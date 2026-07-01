import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants/appConfig';
import { useGameStore } from '../store/gameStore';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Добавляем Bearer-токен из store перед каждым запросом
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// На 401 — разлогиниваем пользователя (нет window.location в RN)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      // Сбрасываем Zustand store → автоматически покажется AuthScreen
      useGameStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
export { BASE_URL };
