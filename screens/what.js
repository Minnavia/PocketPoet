import { View } from "react-native";
import { Text, Button } from "react-native-paper";

export default function What({navigation}) {
    return(
        <View>
            <Text>What</Text>
            <Button onPress={() => navigation.navigate('SignUp')}>What?</Button>
        </View>
    )
}