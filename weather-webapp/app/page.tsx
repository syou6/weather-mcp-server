'use client';

import { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
}

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const FREE_LIMIT = 10;

  const fetchWeather = async () => {
    if (!city) {
      setError('都市名を入力してください');
      return;
    }

    if (usageCount >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 実際のAPIエンドポイントを呼び出す
      const response = await axios.post('/api/weather', { city });
      setWeather(response.data);
      setUsageCount(usageCount + 1);
    } catch (err) {
      setError('天気情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🌤️ 天気予報アプリ
        </h1>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="都市名を入力（例: Tokyo, New York）"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '取得中...' : '天気を確認'}
            </button>
          </div>

          {/* 使用状況 */}
          <div className="mt-4 text-sm text-gray-600">
            本日の使用回数: {usageCount} / {FREE_LIMIT}
            {usageCount >= FREE_LIMIT / 2 && usageCount < FREE_LIMIT && (
              <span className="text-orange-500 ml-2">
                (残り {FREE_LIMIT - usageCount} 回)
              </span>
            )}
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {/* アップグレード促進 */}
        {showUpgrade && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="font-bold text-lg mb-2">
              ⚠️ 無料枠を超えました
            </h3>
            <p className="mb-4">
              本日の無料枠（{FREE_LIMIT}回）を使い切りました。
              プレミアムプランにアップグレードして無制限アクセスを取得しましょう！
            </p>
            <div className="bg-white p-4 rounded mb-4">
              <h4 className="font-semibold mb-2">🎯 プレミアムプラン特典</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>無制限の天気確認</li>
                <li>7日間予報</li>
                <li>1時間ごとの詳細予報</li>
                <li>複数都市の同時確認</li>
                <li>広告なし</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.href = '/upgrade'}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              月額1,500円でアップグレード →
            </button>
          </div>
        )}

        {/* 天気情報表示 */}
        {weather && !showUpgrade && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">{weather.location}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-3xl font-bold text-blue-600">
                  {weather.temperature}°C
                </div>
                <div className="text-gray-600">気温</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-xl font-semibold text-green-600">
                  {weather.condition}
                </div>
                <div className="text-gray-600">天候</div>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <div className="text-xl font-semibold text-purple-600">
                  {weather.humidity}%
                </div>
                <div className="text-gray-600">湿度</div>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <div className="text-xl font-semibold text-orange-600">
                  {weather.wind_speed} km/h
                </div>
                <div className="text-gray-600">風速</div>
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="text-center text-white text-sm mt-8">
          <p>ログイン不要 • 簡単操作 • 正確な天気情報</p>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}