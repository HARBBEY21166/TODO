
import Layout from '@/components/ui/Layout';
import { ThemedText, ThemedView } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Keyboard, Platform, TouchableOpacity } from 'react-native';
import FocusTimer from '../../components/FocusTimer';
import MoodSelector from '../../components/MoodSelector';
import WeeklySummary from '../../components/WeeklySummary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditToDoModal from '../../components/EditToDoModal';
import PrioritySelector from '../../components/PrioritySelector';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

interface ToDo {
  id: string;
  text: string;
  completed: boolean;
  mood?: string;
  completedAt?: Date;
  priority?: 'High' | 'Medium' | 'Low';
  dueDate?: Date;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ToDoScreen() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [text, setText] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);
  const [prioritizingTodo, setPrioritizingTodo] = useState<ToDo | null>(null);
  const [schedulingTodo, setSchedulingTodo] = useState<ToDo | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
    loadTodos();
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
        saveTodos();
    }
  }, [todos]);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const schedulePushNotification = async (todo: ToDo) => {
    if (todo.dueDate) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: todo.text,
        },
        trigger: { date: todo.dueDate },
      });
    }
  };

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos !== null) {
        const parsedTodos = JSON.parse(savedTodos).map((todo: ToDo) => ({
          ...todo,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Failed to load todos', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos', error);
    }
  };

  const addTodo = useCallback(() => {
    if (text.trim().length > 0) {
      setTodos(prevTodos => [
        ...prevTodos, 
        { id: Date.now().toString(), text, completed: false, priority: 'Medium' }
      ]);
      setText('');
      Keyboard.dismiss();
    }
  }, [text]);

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      setSelectedTodoId(id);
      setMoodModalVisible(true);
    } else {
      setTodos(
        todos.map(t =>
          t.id === id
            ? { ...t, completed: false, mood: undefined, completedAt: undefined }
            : t
        )
      );
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const openEditModal = (todo: ToDo) => {
    setEditingTodo(todo);
    setEditModalVisible(true);
  };

  const handleUpdateTodo = (text: string) => {
    if (editingTodo) {
      setTodos(
        todos.map(todo =>
          todo.id === editingTodo.id ? { ...todo, text } : todo
        )
      );
      setEditModalVisible(false);
      setEditingTodo(null);
    }
  };

  const openPrioritySelector = (todo: ToDo) => {
    setPrioritizingTodo(todo);
    setPriorityModalVisible(true);
  };

  const handleSetPriority = (priority: 'High' | 'Medium' | 'Low') => {
    if (prioritizingTodo) {
      const updatedTodo = { ...prioritizingTodo, priority };
      setTodos(
        todos.map(todo =>
          todo.id === prioritizingTodo.id ? updatedTodo : todo
        )
      );
    }
    setPriorityModalVisible(false);
    setPrioritizingTodo(null);
  };

  const showDatepicker = (todo: ToDo) => {
    setSchedulingTodo(todo);
    setDate(todo.dueDate || new Date());
    setShowDatePicker(true);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (schedulingTodo) {
      const updatedTodo = { ...schedulingTodo, dueDate: currentDate };
      setTodos(
        todos.map(todo =>
          todo.id === schedulingTodo.id ? updatedTodo : todo
        )
      );
      schedulePushNotification(updatedTodo);
      setSchedulingTodo(null);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(prevState => !prevState);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
  };

  const handleSelectMood = (mood: string) => {
    if (selectedTodoId) {
      setTodos(
        todos.map(todo =>
          todo.id === selectedTodoId
            ? { ...todo, completed: true, mood, completedAt: new Date() }
            : todo
        )
      );
    }
    setMoodModalVisible(false);
    setSelectedTodoId(null);
  };

  const sortedTodos = useMemo(() => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const priorityA = a.priority ? priorityOrder[a.priority] : 4;
      const priorityB = b.priority ? priorityOrder[b.priority] : 4;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [todos]);

  const getPriorityStyle = (priority?: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return styles.highPriority;
      case 'Medium':
        return styles.mediumPriority;
      case 'Low':
        return styles.lowPriority;
      default:
        return {};
    }
  };

  const renderItem = ({ item }: { item: ToDo }) => {
    return (
      <ThemedView lightColor={Colors.light.background} darkColor={Colors.dark.background} style={[styles.todoItem, item.completed && styles.todoItemCompleted]}>
          <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.todoCheckbox}>
              {item.completed && <Ionicons name="checkmark" size={20} color={Colors.light.background} />}
          </TouchableOpacity>
          <ThemedView style={styles.todoContent}>
              <ThemedText style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
                  {item.text}
              </ThemedText>
              {item.dueDate && (
                  <ThemedView style={styles.dueDateContainer}>
                      <Ionicons name="calendar-outline" size={14} color={Colors.white} />
                      <ThemedText style={styles.dueDateText}>
                          {new Date(item.dueDate).toLocaleDateString()}
                      </ThemedText>
                  </ThemedView>
              )}
          </ThemedView>
          <ThemedView style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => openPrioritySelector(item)} style={[styles.priorityButton, getPriorityStyle(item.priority)]}>
                  <ThemedText style={styles.priorityButtonText}>{item.priority}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showDatepicker(item)} style={styles.actionButton}>
                  <Ionicons name="time-outline" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
          </ThemedView>
      </ThemedView>
    );
  };

  return (
    <Layout title="To-Do">
      <ThemedView lightColor={Colors.light.lightGray} darkColor={Colors.dark.lightGray} style={styles.container}>
        <ThemedText style={styles.header}>Good morning, User!</ThemedText>
        <ThemedText style={styles.subHeader}>You've got {todos.filter(t => !t.completed).length} tasks today.</ThemedText>

        <ThemedView style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Write a new task..."
                value={text}
                onChangeText={setText}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                <Ionicons name="add" size={24} color={Colors.light.background} />
            </TouchableOpacity>
        </ThemedView>

        <FocusTimer
          isRunning={isTimerRunning}
          onToggle={handleToggleTimer}
          onReset={handleResetTimer}
        />

        <WeeklySummary todos={todos} />

        <FlatList
          data={sortedTodos}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />

        <MoodSelector
          visible={moodModalVisible}
          onClose={() => setMoodModalVisible(false)}
          onSelect={handleSelectMood}
        />

        {editingTodo && (
          <EditToDoModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            onSave={handleUpdateTodo}
            initialText={editingTodo.text}
          />
        )}

        {prioritizingTodo && (
          <PrioritySelector
            visible={priorityModalVisible}
            onClose={() => setPriorityModalVisible(false)}
            onSelect={handleSetPriority}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        )}
      </ThemedView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 15,
  },
  subHeader: {
      fontSize: 16,
      marginBottom: 20,
      paddingLeft: 15,
  },
  inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: <Colors className="grey"></Colors>.background,
  },
  input: {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    marginRight: 10,
  },
  addButton: {
      marginLeft: 10,
      backgroundColor: Colors.light.tint,
      borderRadius: 15,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
  },
  listContainer: {
      paddingBottom: 100,
      paddingHorizontal: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  todoItemCompleted: {
      backgroundColor: Colors.light.lightGray,
  },
  todoCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: Colors.light.tint,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  todoTextCompleted: {
      textDecorationLine: 'line-through',
  },
  dueDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
  },
  dueDateText: {
    fontSize: 14,
    marginLeft: 5,
  },
  actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  priorityButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 10,
  },
  priorityButtonText: {
      fontWeight: 'bold',
      color: Colors.light.background,
  },
  actionButton: {
      marginLeft: 10,
  },
  highPriority: {
    backgroundColor: '#E57373', // Softer red
  },
  mediumPriority: {
    backgroundColor: '#FFB74D', // Softer orange
  },
  lowPriority: {
    backgroundColor: '#81C784', // Softer green
  },
});
