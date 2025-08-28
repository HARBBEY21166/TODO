
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface EditToDoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialText: string;
}

export default function EditToDoModal({ visible, onClose, onSave, initialText }: EditToDoModalProps) {
  const [text, setText] = useState(initialText);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

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
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      color: Colors[colorScheme ?? 'light'].text,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      width: 200,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
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
          <Text style={styles.modalText}>Edit To-Do</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Edit your to-do"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color={Colors[colorScheme ?? 'light'].tint} />
            <Button title="Save" onPress={() => onSave(text)} color={Colors[colorScheme ?? 'light'].tint} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
