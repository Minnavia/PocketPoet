import { StyleSheet, View, Text, KeyboardAvoidingView, AccessibilityInfo, TouchableOpacity, accessibilityHint, Pressable } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase.config"
import { useState } from "react"
import { Button, TextInput } from "react-native-paper";

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
    }

    const fastLogin = async() => {
        try {
            const response = await signInWithEmailAndPassword(auth, 'testi@testi.com', 'testitesti');
            console.log(response);
        } catch(error){
            console.log(error);
        } 
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={{fontSize: 20}} id="header">Login</Text>
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
                            textContentType="password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            activeUnderlineColor="#874CCC"
                            underlineColor="#BEADFA"
                        />
                </View>
                <View>
                    <Button
                        onPress={() => fastLogin()}
                    >Fast login </Button>
                    <Button
                        mode="contained"
                        buttonColor="#874CCC"
                        rippleColor='#BEADFA'
                        onPress={() => handleLogIn()}
                    >Login</Button>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('SignUp')}
                    >Don't have an account?</Button>
                </View>
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
    input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    },
    focused: {
        borderColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    error: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 4,
    },
})