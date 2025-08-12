import { NextRequest, NextResponse } from 'next/server';

// モックデータ（実際はOpenWeatherMap APIなどを使用）
const mockWeatherData: Record<string, any> = {
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

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();
    
    if (!city) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
    }

    const normalizedCity = city.toLowerCase();
    const weatherData = mockWeatherData[normalizedCity] || {
      location: city,
      temperature: 20,
      condition: 'Clear',
      humidity: 50,
      wind_speed: 10
    };

    // ここで実際のAPI呼び出しや使用量チェックを行う
    
    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}