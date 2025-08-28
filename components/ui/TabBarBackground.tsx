
import { ThemedView } from '@/components/Themed';
import { Colors } from '@/constants/Colors';

export default function TabBarBackground() {
  return (
    <ThemedView
      lightColor={Colors.light.lightGray}
      darkColor={Colors.dark.lightGray}
      style={{ flex: 1 }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
