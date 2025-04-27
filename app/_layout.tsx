import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import 'react-native-reanimated';
import { CustomSplash } from '../src/components/CustomSplash';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/auth.store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const router = useRouter();
  const { token, checkAuth } = useAuthStore();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Daha modern fontlar ekleyebilirsiniz
    // 'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    // 'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    // 'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isSplashVisible) {
      if (!token) {
        router.replace('/auth/login');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [token, isSplashVisible]);

  const handleSplashComplete = () => {
    setIsSplashVisible(false);
  };

  if (!loaded) {
    return null;
  }

  if (isSplashVisible) {
    return <CustomSplash onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        translucent={true}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#333333',
          // Modern bir görünüm için header'ı özelleştiriyoruz
          headerTitleAlign: 'center',
          // Animasyon ekleyelim
          animation: 'slide_from_right',
          // Daha modern bir görünüm için
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa',
          },
          // Header yüksekliğini ayarlayalım
        }}
      >
        <Stack.Screen 
          name="index"
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="(tabs)"
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="auth"
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: '',
            headerTransparent: true,
            headerLeft: ({ canGoBack }) => canGoBack ? (
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Ionicons 
                  name="chevron-back" 
                  size={24} 
                  color="#333333" 
                />
              </View>
            ) : null,
            headerRight: () => (
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Ionicons 
                  name="heart-outline" 
                  size={20} 
                  color="#333333" 
                />
              </View>
            ),
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}