import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function Explore() {
  return (
    <SafeAreaView style={styles.containers}>
    {/* <View > */}
      <Text>Explore Page</Text>
    {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex:1,
    // width: '300%',
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 3,
    borderColor: 'green'
  }
});
