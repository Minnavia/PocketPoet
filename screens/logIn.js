import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native"
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

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={{fontSize: 20}}>Login</Text>
            <View style={styles.section}>
                <Text>Email</Text>
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                />
            </View>
            <View style={styles.section}>
            <Text>Password</Text>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                />
            </View>
            <Button
                mode="contained"
                buttonColor="#874CCC"
                rippleColor='#BEADFA'
                onPress={() => handleLogIn()}
            >Login</Button>
            <Button
                onPress={() => navigation.navigate('SignUp')}
            >Don't have an account?</Button>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        backgroundColor: '#fff',
        width: '50%',
        paddingBottom: 10
    },
})