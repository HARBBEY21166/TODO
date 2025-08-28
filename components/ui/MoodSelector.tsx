
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface MoodSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (mood: string) => void;
}

const moods = ['😀', '😐', '😢', '😠', '😴'];

export default function MoodSelector({ visible, onClose, onSelect }: MoodSelectorProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      color: Colors[colorScheme ?? 'light'].text,
    },
    moodsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    mood: {
      padding: 10,
    },
    moodText: {
      fontSize: 30,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: Colors[colorScheme ?? 'light'].tint,
    },
    textStyle: {
      color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>How are you feeling?</Text>
          <View style={styles.moodsContainer}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood}
                style={styles.mood}
                onPress={() => onSelect(mood)}
              >
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
