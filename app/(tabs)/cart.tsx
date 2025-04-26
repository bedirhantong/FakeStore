import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.text,
        { color: colorScheme === 'dark' ? '#fff' : '#000' }
      ]}>
        Cart Coming Soon
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