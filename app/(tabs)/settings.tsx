import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthService } from '../../src/api/services/auth.service';

interface SettingsItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthService.getInstance().logout();
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const settingsOptions: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-circle-outline',
          label: 'Edit Profile',
//          onPress: () => router.push('/profile/edit'),
        },
        {
          icon: 'notifications-outline',
          label: 'Notifications',
//          onPress: () => router.push('/settings/notifications'),
        },
        {
          icon: 'lock-closed-outline',
          label: 'Privacy & Security',
//          onPress: () => router.push('/settings/privacy'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'language-outline',
          label: 'Language',
//          onPress: () => router.push('/settings/language'),
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
//          onPress: () => router.push('/settings/theme'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
//          onPress: () => router.push('/settings/help'),
        },
        {
          icon: 'information-circle-outline',
          label: 'About',
//          onPress: () => router.push('/settings/about'),
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}
    >
      {settingsOptions.map((section, sectionIndex) => (
        <View
          key={section.title}
          style={[
            styles.section,
            { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#cccccc' : '#666666' }
            ]}
          >
            {section.title}
          </Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.option,
                itemIndex !== section.items.length - 1 && styles.borderBottom,
                { borderBottomColor: isDark ? '#333333' : '#f0f0f0' }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isDark ? '#cccccc' : '#666666'}
                  style={styles.optionIcon}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    { color: isDark ? '#ffffff' : '#333333' }
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? '#666666' : '#999999'}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
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
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 