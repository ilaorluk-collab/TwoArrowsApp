import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { AuthScreen } from '@/screens/AuthScreen';
import { PlaceholderScreen } from '@/screens/PlaceholderScreen';

export default function AppIndex() {
  const screen = useGameStore((s) => s.screen);
  const token = useGameStore((s) => s.token);
  const setScreen = useGameStore((s) => s.setScreen);

  // Если есть сохранённый токен, но экран AUTH — переходим в LOBBY
  useEffect(() => {
    if (token && screen === 'AUTH') {
      setScreen('LOBBY');
    }
  }, [token, screen, setScreen]);

  // ── State Machine ────────────────────────────────────────────────────────
  switch (screen) {
    case 'AUTH':
      return <AuthScreen />;
    case 'LOBBY':
    case 'SEARCHING':
      return <PlaceholderScreen name="Лобби" />;
    case 'GAME':
      return <PlaceholderScreen name="Игра" />;
    case 'PROFILE':
      return <PlaceholderScreen name="Профиль" />;
    case 'MATCHES':
      return <PlaceholderScreen name="Мэтчи" />;
    default:
      return <AuthScreen />;
  }
}
