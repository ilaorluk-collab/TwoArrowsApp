import { View, Text, StyleSheet } from 'react-native';

interface PlaceholderScreenProps {
  name: string;
}

export function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>В разработке...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    gap: 8,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3d2c2c',
  },
  subtitle: {
    fontSize: 14,
    color: '#9e8a8a',
  },
});
