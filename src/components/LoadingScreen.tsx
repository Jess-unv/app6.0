// src/components/LoadingScreen.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" /> 
      <Text style={styles.text}>Cargando noticias...</Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});
