import { StyleSheet, View, Text, Alert } from "react-native"
import {TextInput} from "react-native-paper"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase.config"
import { useState } from "react"
import { Button } from "react-native-paper";

export default function LogIn({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogIn = async() => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch(error){
            console.log(error);
        } 
    };

    console.log('log in')

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <Button
                onPress={() => handleLogIn()}
            >Login</Button>
            <Button
                onPress={() => navigation.navigate('SignUp')}
            >Don't have an account?</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})