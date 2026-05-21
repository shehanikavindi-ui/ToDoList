import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput, ImageBackground, Alert } from "react-native";

export default function Index() {

  useEffect(() => {
    loadTasks();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [modalVisible]);

  type Task = {
    id: string;
    title: string;
    completed: boolean;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  const saveTask = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem("TASKS", JSON.stringify(newTasks));
    } catch (e) {
      console.error(e);
    }
  };

  const loadTasks = async () => {
    try {
      const value = await AsyncStorage.getItem("TASKS");
      if (value !== null) {
        setTasks(JSON.parse(value));
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== id);
            setTasks(updatedTasks);
            saveTask(updatedTasks);
          },
        },
      ]
    );
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTask(updatedTasks);
  };


  return (
    <ImageBackground
      source={require("../assets/images/wallpaper.jpg")}
      style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        {tasks.map((item) => (
          <Pressable
            key={item.id}
            style={styles.bubble}
            onLongPress={() => deleteTask(item.id)}
            delayLongPress={400}
          >
            <Pressable style={[styles.tickBox, item.completed && styles.tickBoxDone]} onPress={() => toggleTask(item.id)}>
              {item.completed && <Text style={styles.tick}>✓</Text>}
            </Pressable>

            <Text style={[styles.text, item.completed && styles.textDone]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addNewBtn}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addNewBtnText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>

            <View style={styles.NewTaskModel}>

              <TextInput style={styles.textInput}
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder="Write something..."
                placeholderTextColor="#8f6981"
                multiline={true}></TextInput>

              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.doneBtn}
                onPress={() => {
                  if (!text.trim()) return;

                  const newTask: Task = {
                    id: Date.now().toString(),
                    title: text,
                    completed: false,
                  };

                  const updatedTasks = [...tasks, newTask];

                  setTasks(updatedTasks);
                  saveTask(updatedTasks);

                  setText("");
                  setModalVisible(false);
                }}>
                <Text style={styles.doneBtnText}>Done</Text>
              </Pressable>

            </View>
          </KeyboardAvoidingView>
        </View>

      </Modal>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffe5f6",
    height: "100%",
    width: "100%",
  },
  content: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    paddingBottom: 120,
  },
  bubble: {
    paddingLeft: 20,
    width: "100%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // shadow (Android)
    elevation: 3,
  },
  tickBox: {
    height: "30%",
    aspectRatio: 1,
    borderColor: "#cfb6c6",
    borderWidth: 1.5,
    borderRadius: 5,
  },
  tickBoxDone: {
    backgroundColor: "#b685a5",
    borderColor: "#b685a5",
  },
  tick: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  textDone: {
    textDecorationLine: "line-through",
    color: "#c0a0b5",
  },
  text: {
    color: "#737373",
    paddingLeft: 15,
    fontSize: 16,
  },
  addNewBtn: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    backgroundColor: "#b685a5",
    bottom: 45,
    right: 35,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",

    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // shadow (Android)
    elevation: 3,
  },
  addNewBtnText: {
    color: "white",
    fontSize: 35,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  NewTaskModel: {
    backgroundColor: "white",
    width: "90%",
    height: 200,
    position: "absolute",
    bottom: 0,
    borderRadius: 30,
    justifyContent: "flex-start",
    alignSelf: "center",
    padding: 20,
    marginBottom: 15,
  },
  textInput: {
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 17,
    color: "#737373"
  },
  doneBtn: {
    width: 70,
    height: 40,
    backgroundColor: "rgba(230, 163, 224, 0.22)",
    position: "absolute",
    bottom: 20,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,

  },
  doneBtnText: {
    color: "#6b3d5b",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelBtn: {
    width: 70,
    height: 40,
    backgroundColor: "rgba(230, 163, 183, 0.22)",
    position: "absolute",
    bottom: 20,
    right: 95,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,

  },
  cancelBtnText: {
    color: "#642626",
    fontWeight: "bold",
    fontSize: 16,
  },
});