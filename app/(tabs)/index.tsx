import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import AppIo from "../Home";

export default function HomeLayout() {

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      <AppIo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#212121ff",
  },
});
