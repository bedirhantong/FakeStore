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
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { router, Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading } = useAuthStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await signup({ username, email, password });
      Alert.alert(
        'Success',
        'Account created successfully! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: isDark ? '#ffffff' : '#1a1a1a' }
          ]}>Create Account</Text>
          <Text style={[
            styles.subtitle,
            { color: isDark ? '#cccccc' : '#666666' }
          ]}>Join our shopping community</Text>
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
              name="mail-outline"
              size={20}
              color={isDark ? '#cccccc' : '#666666'}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { color: isDark ? '#ffffff' : '#1a1a1a' }
              ]}
              placeholder="Email"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
              placeholder="Confirm Password"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              { opacity: isLoading ? 0.7 : 1 }
            ]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              { color: isDark ? '#cccccc' : '#666666' }
            ]}>Already have an account?</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  signupButton: {
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
  signupButtonText: {
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
  loginLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
}); 