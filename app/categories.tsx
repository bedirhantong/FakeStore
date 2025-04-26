import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa' }
    ]}>
      <Text style={[
        styles.title,
        { color: colorScheme === 'dark' ? '#ffffff' : '#333333' }
      ]}>Categories</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
}); 