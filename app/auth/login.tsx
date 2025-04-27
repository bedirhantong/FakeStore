import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { useCartStore } from '../../src/store/cart.store';
import { router, Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('donero');
  const [password, setPassword] = useState('ewedon');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const { initializeUserCart } = useCartStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const { user } = await login({ username, password });
      // Login başarılı olduktan sonra kullanıcının cart'ını başlat
      if (user?.id) {
        await initializeUserCart(user.id);
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}
    >
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: isDark ? '#ffffff' : '#1a1a1a' }
        ]}>Welcome Back!</Text>
        <Text style={[
          styles.subtitle,
          { color: isDark ? '#cccccc' : '#666666' }
        ]}>Sign in to continue shopping</Text>
      </View>

      <View style={styles.form}>
        <View style={[
          styles.inputContainer,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}>
          <Ionicons
            name="person-outline"
            size={20}
            color={isDark ? '#cccccc' : '#666666'}
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.input,
              { color: isDark ? '#ffffff' : '#1a1a1a' }
            ]}
            placeholder="Username"
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={[
          styles.inputContainer,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={isDark ? '#cccccc' : '#666666'}
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.input,
              { color: isDark ? '#ffffff' : '#1a1a1a' }
            ]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={isDark ? '#cccccc' : '#666666'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { opacity: isLoading ? 0.7 : 1 }
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[
            styles.footerText,
            { color: isDark ? '#cccccc' : '#666666' }
          ]}>Don't have an account?</Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#3498db',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
  signupLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
}); 