
import React from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface PrioritySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (priority: 'High' | 'Medium' | 'Low') => void;
}

export default function PrioritySelector({ visible, onClose, onSelect }: PrioritySelectorProps) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Priority</Text>
          <View style={styles.prioritiesContainer}>
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority}
                style={styles.priority}
                onPress={() => onSelect(priority)}
              >
                <Text style={styles.priorityText}>{priority}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Close" onPress={onClose} color={Colors[colorScheme ?? 'light'].tint} />
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colorScheme: string | null | undefined) => StyleSheet.create({
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
  prioritiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  priority: {
    padding: 10,
  },
  priorityText: {
    fontSize: 18,
    color: Colors[colorScheme ?? 'light'].text,
  },
});
