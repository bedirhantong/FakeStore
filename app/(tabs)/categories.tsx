import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.text,
        { color: colorScheme === 'dark' ? '#fff' : '#000' }
      ]}>
        Categories Coming Soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
}); 