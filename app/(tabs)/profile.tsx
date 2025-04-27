import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useAuthStore } from '../../src/store/auth.store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, isLoading, fetchUserDetails } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    fetchUserDetails().catch(console.error);
  }, []);

  const navigateToSettings = () => {
    router.push('/(tabs)/settings');
  };

  if (isLoading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}
    >
      {/* Header Section */}
      <View style={[
        styles.header,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
      ]}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name?.firstname || 'User') }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={[
              styles.editImageButton,
              { backgroundColor: isDark ? '#333333' : '#f0f0f0' }
            ]}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={isDark ? '#ffffff' : '#333333'}
            />
          </TouchableOpacity>
        </View>
        <Text style={[
          styles.name,
          { color: isDark ? '#ffffff' : '#333333' }
        ]}>
          {user?.name?.firstname} {user?.name?.lastname}
        </Text>
        <Text style={[
          styles.email,
          { color: isDark ? '#cccccc' : '#666666' }
        ]}>
          {user?.email}
        </Text>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCards}>
        <View style={[
          styles.infoCard,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}>
          <Ionicons
            name="location-outline"
            size={24}
            color={isDark ? '#cccccc' : '#666666'}
          />
          <View style={styles.infoCardContent}>
            <Text style={[
              styles.infoCardTitle,
              { color: isDark ? '#ffffff' : '#333333' }
            ]}>Location</Text>
            <Text style={[
              styles.infoCardText,
              { color: isDark ? '#cccccc' : '#666666' }
            ]}>
              {user?.address?.city || 'Not set'} {user?.address?.zipcode ? `(${user?.address?.zipcode})` : ''}
            </Text>
          </View>
        </View>

        <View style={[
          styles.infoCard,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}>
          <Ionicons
            name="call-outline"
            size={24}
            color={isDark ? '#cccccc' : '#666666'}
          />
          <View style={styles.infoCardContent}>
            <Text style={[
              styles.infoCardTitle,
              { color: isDark ? '#ffffff' : '#333333' }
            ]}>Phone</Text>
            <Text style={[
              styles.infoCardText,
              { color: isDark ? '#cccccc' : '#666666' }
            ]}>
              {user?.phone || 'Not set'}
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Button */}
      <TouchableOpacity
        style={[
          styles.settingsButton,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}
        onPress={navigateToSettings}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={isDark ? '#cccccc' : '#666666'}
        />
        <Text style={[
          styles.settingsButtonText,
          { color: isDark ? '#ffffff' : '#333333' }
        ]}>Settings</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#666666' : '#999999'}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  infoCards: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoCardContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 16,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingsButtonText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
}); 