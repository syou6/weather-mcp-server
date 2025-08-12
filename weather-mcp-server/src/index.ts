#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// 使用量追跡（実際はDBを使用）
const usageTracker = new Map<string, { count: number; lastReset: Date }>();

// 無料枠の制限
const FREE_LIMIT = 10;

interface WeatherResponse {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
}

class WeatherMCPServer {
  private server: Server;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    this.server = new Server(
      {
        name: 'weather-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private async checkUsageLimit(userId: string): Promise<{ allowed: boolean; remaining: number; upgradeUrl?: string }> {
    const usage = usageTracker.get(userId) || { count: 0, lastReset: new Date() };
    
    // リセット（日次）
    const now = new Date();
    if (now.getDate() !== usage.lastReset.getDate()) {
      usage.count = 0;
      usage.lastReset = now;
    }

    const remaining = FREE_LIMIT - usage.count;
    
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        upgradeUrl: 'https://weather-mcp.com/upgrade'
      };
    }

    return { allowed: true, remaining };
  }

  private async fetchWeather(city: string): Promise<WeatherResponse> {
    // 実際のAPI呼び出し（OpenWeatherMapなど）をシミュレート
    // デモ用のモックデータ
    const mockData: Record<string, WeatherResponse> = {
      'tokyo': {
        location: 'Tokyo, Japan',
        temperature: 18,
        condition: 'Partly Cloudy',
        humidity: 65,
        wind_speed: 12
      },
      'new york': {
        location: 'New York, USA',
        temperature: 22,
        condition: 'Sunny',
        humidity: 45,
        wind_speed: 8
      },
      'london': {
        location: 'London, UK',
        temperature: 15,
        condition: 'Rainy',
        humidity: 80,
        wind_speed: 20
      }
    };

    const normalizedCity = city.toLowerCase();
    return mockData[normalizedCity] || {
      location: city,
      temperature: 20,
      condition: 'Clear',
      humidity: 50,
      wind_speed: 10
    };
  }

  private setupHandlers() {
    // ツール一覧を返す
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_weather',
            description: 'Get current weather information for a city',
            inputSchema: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                  description: 'City name (e.g., Tokyo, New York, London)',
                },
                userId: {
                  type: 'string',
                  description: 'User ID for usage tracking',
                  default: 'anonymous'
                }
              },
              required: ['city'],
            },
          },
          {
            name: 'get_forecast',
            description: 'Get 7-day weather forecast (Premium feature)',
            inputSchema: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                  description: 'City name',
                },
                userId: {
                  type: 'string',
                  description: 'User ID',
                  default: 'anonymous'
                },
                apiKey: {
                  type: 'string',
                  description: 'Premium API key'
                }
              },
              required: ['city'],
            },
          },
        ],
      };
    });

    // ツール実行
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'get_weather') {
        const city = args?.city as string;
        const userId = args?.userId as string || 'anonymous';

        // 使用量チェック
        const usageCheck = await this.checkUsageLimit(userId);
        
        if (!usageCheck.allowed) {
          return {
            content: [
              {
                type: 'text',
                text: `⚠️ 無料枠を超えました（本日${FREE_LIMIT}回まで）\n\n` +
                      `🎯 プレミアムプランにアップグレード:\n` +
                      `${usageCheck.upgradeUrl}\n\n` +
                      `特典:\n` +
                      `• 無制限の天気確認\n` +
                      `• 7日間予報\n` +
                      `• 詳細な気象データ\n` +
                      `• APIキー即時発行\n` +
                      `• 月額1,500円`
              },
            ],
          };
        }

        // 天気データ取得
        const weather = await this.fetchWeather(city);

        // 使用量カウント
        const usage = usageTracker.get(userId) || { count: 0, lastReset: new Date() };
        usage.count++;
        usageTracker.set(userId, usage);

        return {
          content: [
            {
              type: 'text',
              text: `🌤️ ${weather.location}の天気\n\n` +
                    `気温: ${weather.temperature}°C\n` +
                    `天候: ${weather.condition}\n` +
                    `湿度: ${weather.humidity}%\n` +
                    `風速: ${weather.wind_speed} km/h\n\n` +
                    `📊 本日の残り回数: ${usageCheck.remaining - 1}/${FREE_LIMIT}`
            },
          ],
        };
      }

      if (name === 'get_forecast') {
        const apiKey = args?.apiKey as string;
        
        if (!apiKey || !apiKey.startsWith('sk_live_')) {
          return {
            content: [
              {
                type: 'text',
                text: '🔒 この機能はプレミアム限定です\n\n' +
                      'アップグレードはこちら:\n' +
                      'https://weather-mcp.com/upgrade'
              },
            ],
          };
        }

        // プレミアム機能の実装
        return {
          content: [
            {
              type: 'text',
              text: '📅 7日間予報（プレミアム機能）\n\n' +
                    '月曜: 晴れ 22°C\n' +
                    '火曜: 曇り 20°C\n' +
                    '水曜: 雨 18°C\n' +
                    '...'
            },
          ],
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Weather MCP Server started');
  }
}

const server = new WeatherMCPServer();
server.run().catch(console.error);