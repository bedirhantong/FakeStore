import { View } from 'react-native';
import { Slot } from 'expo-router';
import { CustomBottomBar } from '../../src/components/CustomBottomBar';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <CustomBottomBar />
    </View>
  );
}
