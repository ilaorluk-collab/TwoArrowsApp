import Constants from 'expo-constants';

// Читаем API_URL из app.json → extra.apiUrl
// Чтобы задать URL: добавь "extra": { "apiUrl": "http://..." } в app.json
const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;

export const API_URL: string = extra?.apiUrl ?? 'https://104.171.128.155';
export const BASE_URL = `${API_URL}/api`;
