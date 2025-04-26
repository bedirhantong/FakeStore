import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  label: string;
  icon: string;
  path: string;
}

const TABS: TabItem[] = [
  { name: 'home', label: 'Home', icon: 'home', path: '/(tabs)' },
  { name: 'categories', label: 'Categories', icon: 'grid', path: '/(tabs)/categories' },
  { name: 'cart', label: 'Cart', icon: 'cart', path: '/(tabs)/cart' },
  { name: 'profile', label: 'Profile', icon: 'person', path: '/(tabs)/profile' },
];

export const CustomBottomBar = () => {
  const currentPath = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  console.log('Current path:', currentPath); // Debug için

  const handleTabPress = (path: string) => {
    router.push(path as any);
  };

  const isTabActive = (tabPath: string) => {
    // Home tab için özel kontrol
    if (tabPath === '/(tabs)') {
      return currentPath === '/' || currentPath === '/(tabs)' || currentPath === '/(tabs)/index';
    }
    // Diğer tablar için normal kontrol
    const cleanPath = tabPath.replace('/(tabs)', '');
    return currentPath === cleanPath;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.bottomBar,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
      ]}>
        {TABS.map((tab) => {
          const isActive = isTabActive(tab.path);
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.path)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                  isDark && { backgroundColor: isActive ? '#2c3e50' : 'transparent' }
                ]}>
                  <Ionicons
                    name={(`${tab.icon}${isActive ? '' : '-outline'}`) as any}
                    size={22}
                    color={isActive ? '#3498db' : isDark ? '#888' : '#999'}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                  { color: isDark ? (isActive ? '#3498db' : '#888') : (isActive ? '#3498db' : '#999') }
                ]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 10,
    width: width - 32,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#EBF5FF',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '600',
  },
}); 