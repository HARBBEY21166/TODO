
import { ThemedText, ThemedView } from '@/components/ui/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const colorScheme = useColorScheme();
  return (
    <ThemedView
      style={[
        styles.container,
        { borderBottomColor: colorScheme === 'dark' ? Colors.dark.lightGray : Colors.light.lightGray },
      ]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
