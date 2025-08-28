
import { ThemedView } from '@/components/ui/Themed';
import Header from '@/components/ui/Header';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Header title={title} />
      {children}
    </ThemedView>
  );
}
