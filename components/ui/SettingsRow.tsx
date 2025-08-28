
import { ThemedText, ThemedView } from '@/components/ui/Themed';
import { StyleSheet } from 'react-native';

interface SettingsRowProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsRow({ title, children }: SettingsRowProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
  },
});
