import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const prisma = new PrismaClient();

// 価格設定
const PRICING = {
  free: { 
    price: 0, 
    limits: { daily_calls: 10, features: ['basic_weather'] }
  },
  basic: { 
    price_id: 'price_basic_1500', 
    price: 1500,
    limits: { daily_calls: 100, features: ['basic_weather', 'forecast'] }
  },
  pro: { 
    price_id: 'price_pro_3000',
    price: 3000,
    limits: { daily_calls: -1, features: ['all'] } // -1 = unlimited
  }
};

// ==========================================
// 1. Webサイトでの決済ページ
// ==========================================

app.post('/api/create-checkout-session', async (req, res) => {
  const { plan, userId } = req.body;
  
  try {
    // Stripe Checkoutセッション作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: PRICING[plan as keyof typeof PRICING].price_id,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/pricing`,
      metadata: {
        userId,
        plan
      },
      // 7日間の無料トライアル
      subscription_data: {
        trial_period_days: 7,
      },
      // 自動的にtax_id収集
      automatic_tax: { enabled: true },
      customer_email: req.body.email,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ==========================================
// 2. Stripe Webhook（決済完了処理）
// ==========================================

app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, plan } = session.metadata!;

        // APIキー生成
        const apiKey = `sk_live_${crypto.randomBytes(32).toString('hex')}`;

        // ユーザー情報更新
        await prisma.user.upsert({
          where: { id: userId },
          update: {
            plan,
            apiKey,
            subscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            id: userId,
            email: session.customer_email!,
            plan,
            apiKey,
            subscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        // ウェルカムメール送信
        await sendWelcomeEmail(session.customer_email!, apiKey, plan);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // サブスクキャンセル処理
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: { 
            subscriptionStatus: 'cancelled',
            plan: 'free'
          }
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // 支払い失敗処理
        await prisma.user.updateMany({
          where: { customerId: invoice.customer as string },
          data: { subscriptionStatus: 'past_due' }
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error}`);
  }
});

// ==========================================
// 3. MCPサーバー側の認証チェック
// ==========================================

app.post('/api/verify-usage', async (req, res) => {
  const { apiKey, toolName } = req.body;

  try {
    // APIキーでユーザー検索
    const user = await prisma.user.findUnique({
      where: { apiKey },
      include: { usage: true }
    });

    if (!user) {
      return res.json({ 
        allowed: false, 
        message: 'Invalid API key',
        upgradeUrl: `${process.env.DOMAIN}/pricing`
      });
    }

    // プランの制限チェック
    const limits = PRICING[user.plan as keyof typeof PRICING].limits;
    
    // 今日の使用量チェック
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = await prisma.usage.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(today),
          lt: new Date(today + 'T23:59:59')
        }
      }
    });

    if (limits.daily_calls !== -1 && todayUsage >= limits.daily_calls) {
      return res.json({
        allowed: false,
        message: `Daily limit reached (${limits.daily_calls} calls)`,
        upgradeUrl: `${process.env.DOMAIN}/upgrade`,
        currentPlan: user.plan,
        usage: {
          today: todayUsage,
          limit: limits.daily_calls
        }
      });
    }

    // 機能制限チェック
    if (!limits.features.includes(toolName) && !limits.features.includes('all')) {
      return res.json({
        allowed: false,
        message: `This feature requires ${toolName === 'forecast' ? 'Basic' : 'Pro'} plan`,
        upgradeUrl: `${process.env.DOMAIN}/upgrade?feature=${toolName}`
      });
    }

    // 使用量記録
    await prisma.usage.create({
      data: {
        userId: user.id,
        tool: toolName,
        timestamp: new Date()
      }
    });

    res.json({
      allowed: true,
      remaining: limits.daily_calls === -1 ? 'unlimited' : limits.daily_calls - todayUsage - 1,
      plan: user.plan
    });

  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ==========================================
// 4. 価格ページAPI
// ==========================================

app.get('/api/pricing', (req, res) => {
  res.json({
    plans: [
      {
        name: 'Free',
        price: 0,
        features: [
          '10回/日まで',
          '基本的な天気情報',
          'メールサポート'
        ],
        cta: 'Start Free',
        popular: false
      },
      {
        name: 'Basic',
        price: 1500,
        priceId: PRICING.basic.price_id,
        features: [
          '100回/日まで',
          '7日間予報',
          '優先サポート',
          'APIキー即時発行'
        ],
        cta: 'Start 7-day Trial',
        popular: true
      },
      {
        name: 'Pro',
        price: 3000,
        priceId: PRICING.pro.price_id,
        features: [
          '無制限使用',
          '全機能アクセス',
          '専用サポート',
          'SLA保証',
          'カスタム統合'
        ],
        cta: 'Contact Sales',
        popular: false
      }
    ]
  });
});

// ==========================================
// 5. 使用状況ダッシュボード
// ==========================================

app.get('/api/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 今月の使用状況
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usage = await prisma.usage.groupBy({
      by: ['tool'],
      where: {
        userId,
        createdAt: { gte: startOfMonth }
      },
      _count: { tool: true }
    });

    // 日別使用量（過去7日）
    const dailyUsage = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM usage
      WHERE user_id = ${userId}
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    res.json({
      user: {
        email: user.email,
        plan: user.plan,
        validUntil: user.validUntil,
        apiKey: user.apiKey
      },
      usage: {
        monthly: usage,
        daily: dailyUsage,
        limits: PRICING[user.plan as keyof typeof PRICING].limits
      },
      billing: {
        nextBillingDate: user.validUntil,
        amount: PRICING[user.plan as keyof typeof PRICING].price
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ==========================================
// ヘルパー関数
// ==========================================

async function sendWelcomeEmail(email: string, apiKey: string, plan: string) {
  // SendGrid, Amazon SES, Resend等を使用
  const emailContent = `
    🎉 Welcome to Weather MCP Pro!
    
    Your ${plan} plan is now active.
    
    Your API Key: ${apiKey}
    
    Setup Instructions:
    1. Open Claude Desktop settings
    2. Add this to your MCP config:
    
    {
      "mcpServers": {
        "weather-pro": {
          "command": "npx",
          "args": ["weather-mcp-server"],
          "env": {
            "API_KEY": "${apiKey}"
          }
        }
      }
    }
    
    3. Restart Claude Desktop
    4. Start using premium features!
    
    Need help? Reply to this email.
  `;

  // メール送信処理
  console.log(`Sending welcome email to ${email}`);
}

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});