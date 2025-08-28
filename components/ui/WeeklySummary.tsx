
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedText } from '@/components/ui/Themed';
import { Colors } from '@/constants/Colors';

interface ToDo {
  id: string;
  text: string;
  completed: boolean;
  mood?: string;
  completedAt?: Date;
}

interface WeeklySummaryProps {
  todos: ToDo[];
}

export default function WeeklySummary({ todos }: WeeklySummaryProps) {
  const completedTodos = todos.filter(todo => todo.completed && todo.completedAt);

  const getCompletionTimes = () => {
    const hours: { [key: number]: number } = {};
    completedTodos.forEach(todo => {
      const hour = todo.completedAt!.getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });
    return hours;
  };

  const getTopMoods = () => {
    const moods: { [key: string]: number } = {};
    completedTodos.forEach(todo => {
      if (todo.mood) {
        moods[todo.mood] = (moods[todo.mood] || 0) + 1;
      }
    });
    return Object.entries(moods).sort((a, b) => b[1] - a[1]);
  };

  const completionTimes = getCompletionTimes();
  const topMoods = getTopMoods();

  return (
    <ThemedView lightColor={Colors.light.background} darkColor={Colors.dark.background} style={styles.container}>
      <ThemedText style={styles.title}>Weekly Summary</ThemedText>
      {completedTodos.length > 0 ? (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subtitle}>Productivity Peaks</ThemedText>
            {Object.entries(completionTimes).length > 0 ? (
              Object.entries(completionTimes).map(([hour, count]) => (
                <ThemedText style={styles.text} key={hour}>{`${hour}:00 - ${hour}:59: ${count} tasks`}</ThemedText>
              ))
            ) : (
              <ThemedText style={styles.text}>No tasks completed yet.</ThemedText>
            )}
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.subtitle}>Mood Tracker</ThemedText>
            {topMoods.length > 0 ? (
              topMoods.map(([mood, count]) => (
                <ThemedText style={styles.text} key={mood}>{`${mood}: ${count} times`}</ThemedText>
              ))
            ) : (
              <ThemedText style={styles.text}>No moods logged yet.</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedText style={styles.text}>Complete some tasks to see your summary!</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 15,
      padding: 20,
      marginVertical: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        flex: 1,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
    },
    text: {
        fontSize: 14,
    }
  });
