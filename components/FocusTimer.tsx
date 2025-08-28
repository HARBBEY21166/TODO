
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView, ThemedText } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface FocusTimerProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export default function FocusTimer({ isRunning, onToggle, onReset }: FocusTimerProps) {
  const [time, setTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
        onToggle(); // Stop the timer
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time]);

  const resetTimer = () => {
      onReset();
      setTime(25 * 60);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView lightColor={Colors.light.background} darkColor={Colors.dark.background} style={styles.container}>
      <ThemedText style={styles.title}>Focus Timer</ThemedText>
      <ThemedText style={styles.timerText}>{formatTime(time)}</ThemedText>
      <ThemedView style={styles.buttons}>
        <TouchableOpacity onPress={onToggle} style={styles.button}>
            <Ionicons name={isRunning ? 'pause-outline' : 'play-outline'} size={32} color={Colors.dark.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
            <Ionicons name="refresh-outline" size={32} color={Colors.dark.text} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
      marginHorizontal: 20,
  }
});
