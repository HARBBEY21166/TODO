
import Layout from '@/components/ui/Layout';
import { ThemedView, ThemedText } from '@/components/ui/Themed';
import SettingsRow from '@/components/ui/SettingsRow';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <Layout title="Settings">
      <ThemedView style={styles.container}>
        <SettingsRow title="Dark Mode">
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          />
        </SettingsRow>
        <SettingsRow title="Focus Duration">
          <ThemedText>25 minutes</ThemedText>
        </SettingsRow>
        <SettingsRow title="Break Duration">
          <ThemedText>5 minutes</ThemedText>
        </SettingsRow>
      </ThemedView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
