import React from "react";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <AppNavigator />
    </ThemeProvider>
  );
}