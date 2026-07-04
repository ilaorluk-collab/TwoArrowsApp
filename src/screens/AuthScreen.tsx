import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/gameStore';
import { register, login } from '../api/auth';

export function AuthScreen() {
  const setCurrentUser = useGameStore((s) => s.setCurrentUser);
  const setTokens = useGameStore((s) => s.setTokens);
  const setScreen = useGameStore((s) => s.setScreen);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    const localErrors = {};
    if (!email) localErrors.email = 'Введите email';
    if (!password) localErrors.password = 'Введите пароль';
    if (isRegister && !nickname.trim()) localErrors.nickname = 'Введите никнейм';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setFieldErrors({});
    setError('');
    setLoading(true);

    try {
      const res = isRegister
        ? await register({
            email,
            password,
            nickname: nickname || undefined,
            age: parseInt(age) || 25,
            gender,
            is_adult: agreed,
          })
        : await login({ email, password });

      setTokens(res.access, res.refresh);
      setCurrentUser(res.user);
      setScreen('LOBBY');
      console.error('LOGIN ERROR:', err);
      let errorMsg = err.message || 'Ошибка соединения';
      if (err.response?.data) {
        if (err.response.data.detail) errorMsg = err.response.data.detail;
        else if (err.response.data.error) errorMsg = err.response.data.error;
        else if (typeof err.response.data === 'object') {
          const firstKey = Object.keys(err.response.data)[0];
          if (firstKey) {
            const firstError = err.response.data[firstKey];
            errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFieldErrors({});
    setError('');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bgapp5.jpeg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.fields}>
                <View style={styles.fieldWrapper}>
                  <View style={[styles.inputContainer, !!fieldErrors.email && styles.inputContainerError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#b09a9a"
                      value={email}
                      onChangeText={(v) => { setEmail(v); clearFieldError('email'); }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {!!fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
                </View>

                <View style={styles.fieldWrapper}>
                  <View style={[styles.inputContainer, !!fieldErrors.password && styles.inputContainerError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Пароль (мин. 8 символов)"
                      placeholderTextColor="#b09a9a"
                      value={password}
                      onChangeText={(v) => { setPassword(v); clearFieldError('password'); }}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                  {!!fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
                </View>

                {isRegister && (
                  <View style={styles.fieldWrapper}>
                    <View style={[styles.inputContainer, !!fieldErrors.nickname && styles.inputContainerError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Никнейм"
                        placeholderTextColor="#b09a9a"
                        value={nickname}
                        onChangeText={(v) => { setNickname(v); clearFieldError('nickname'); }}
                        autoCapitalize="none"
                      />
                    </View>
                    {!!fieldErrors.nickname && <Text style={styles.fieldError}>{fieldErrors.nickname}</Text>}
                  </View>
                )}

                {isRegister && (
                  <View style={styles.ageGenderRow}>
                    <View style={[styles.fieldWrapper, { width: '35%' }]}>
                      <View style={[styles.inputContainer, !!fieldErrors.age && styles.inputContainerError]}>
                        <TextInput
                          style={styles.input}
                          placeholder="Возраст"
                          placeholderTextColor="#b09a9a"
                          value={age}
                          onChangeText={(v) => { setAge(v); clearFieldError('age'); }}
                          keyboardType="number-pad"
                        />
                      </View>
                      {!!fieldErrors.age && <Text style={styles.fieldError}>{fieldErrors.age}</Text>}
                    </View>

                    <View style={styles.genderButtons}>
                      <TouchableOpacity
                        style={[styles.genderBtn, styles.genderBtnMale, gender === 'M' && styles.genderBtnMaleActive]}
                        onPress={() => setGender('M')}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.genderBtnText, gender === 'M' && styles.genderBtnTextActive]}>Муж</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderBtn, styles.genderBtnFemale, gender === 'F' && styles.genderBtnFemaleActive]}
                        onPress={() => setGender('F')}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.genderBtnText, gender === 'F' && styles.genderBtnTextActive]}>Жен</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {isRegister && (
                <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
                  <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                    {agreed && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Мне есть 18 лет</Text>
                </TouchableOpacity>
              )}

              {!!error && <Text style={styles.generalError}>{error}</Text>}

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {isRegister ? 'Зарегистрироваться' : 'Войти'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleMode} style={styles.toggleBtn}>
                <Text style={styles.toggleBtnText}>
                  {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
    shadowColor: '#3d1a0a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  logoContainer: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  logo: { width: 160, height: 130 },
  fields: { gap: 10, marginBottom: 12 },
  fieldWrapper: { gap: 4 },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  inputContainerError: { borderColor: '#e53e3e' },
  input: { height: 44, paddingHorizontal: 14, fontSize: 15, color: '#3d2c2c' },
  fieldError: { fontSize: 12, color: '#e53e3e', paddingHorizontal: 4 },
  ageGenderRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  genderButtons: { flex: 1, flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1, height: 44, borderRadius: 8, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  genderBtnMale: { borderColor: '#cf6f4e', backgroundColor: 'transparent' },
  genderBtnMaleActive: { backgroundColor: '#cf6f4e' },
  genderBtnFemale: { borderColor: '#e0b65c', backgroundColor: 'transparent' },
  genderBtnFemaleActive: { backgroundColor: '#e0b65c' },
  genderBtnText: { fontSize: 14, fontWeight: '600', color: '#5c4033' },
  genderBtnTextActive: { color: '#ffffff' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkbox: {
    width: 20, height: 20, borderWidth: 2, borderColor: '#000000',
    borderRadius: 4, justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: 'transparent' },
  checkboxMark: { fontSize: 13, fontWeight: '700', color: '#000000', lineHeight: 16 },
  checkboxLabel: { fontSize: 14, color: '#718096' },
  generalError: { fontSize: 13, color: '#e05a7a', textAlign: 'center', marginBottom: 8 },
  submitBtn: {
    backgroundColor: '#d76a53', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
    shadowColor: '#885149', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  toggleBtn: { alignItems: 'center', paddingVertical: 4 },
  toggleBtnText: { fontSize: 14, color: '#718096' },
});
