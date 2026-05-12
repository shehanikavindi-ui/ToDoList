import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: " To Do List",
        headerStyle: {
          backgroundColor: "#b685a5",
        },
        headerTitleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 24,
        },
      }} />
      <Stack.Screen name="newTask" options={{
        title: " Add New Task ",
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: {
          color: "#b685a5",
          fontWeight: "bold",
          fontSize: 24,
        },
      }}/>
    </Stack>
  );
}
