import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Explore() {
  return (
    <SafeAreaView>
    <View style={styles.containers}>
      <Text>Explore Page</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
