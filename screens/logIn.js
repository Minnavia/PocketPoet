import { StyleSheet, View, Text, KeyboardAvoidingView, AccessibilityInfo, TouchableOpacity, accessibilityHint, Pressable } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase.config"
import { useEffect, useRef, useState } from "react"
import { Button, HelperText, TextInput } from "react-native-paper";
import { useWindowDimensions } from "react-native";

export default function LogIn({navigation}) {

    const {fontScale} = useWindowDimensions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [pswErrorMsg, setPswErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');

    const handleLogIn = async() => {
        setErrorEmail('false');
        setErrorPassword('false');
        setPswErrorMsg('');
        setEmailErrorMsg('');
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch(error) {
            if (error.code == "auth/invalid-email") {
                setErrorEmail(true);
                setEmailErrorMsg("Please provide a valid email address in the format name@domain.com")
            }
            if (error.code == "auth/user-not-found") {
                setErrorEmail(true);
                setEmailErrorMsg("User was not found. Did you mean to sign up?");
            }
            if (error.code == "auth/wrong-password") {
                setErrorPassword(true);
                setPswErrorMsg("Wrong password.")
            }
            if (error.code == "auth/too-many-requests") {
                setEmailErrorMsg("Too many requests. Try again in a few minutes.")
            }
        } 
    }

    const fastLogin = async() => {
        try {
            const response = await signInWithEmailAndPassword(auth, 'manu@koira.com', 'manumanu');
            console.log(response);
        } catch(error){
            console.log(error);
        } 
    }

    const fastLoginRef = useRef();

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={{fontSize: 20}} id="header">Login</Text>
                <View style={[styles.section, {}]}>
                    <Text nativeID="emailLabel">Email</Text>
                    <TextInput
                        autoFocus={true}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        activeUnderlineColor="#874CCC"
                        underlineColor="#BEADFA"
                        accessibilityLabelledBy="emailLabel"
                        error={errorEmail}
                        autoComplete="email"
                    />
                    <HelperText accessibilityLiveRegion="polite" type="error">{emailErrorMsg}</HelperText>
                </View>
                <View style={styles.section}>
                    <Text nativeID="passwordLabel">Password</Text>
                    <TextInput
                        autoCapitalize="none"
                        textContentType="password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        activeUnderlineColor="#874CCC"
                        underlineColor="#BEADFA"
                        accessibilityLabelledBy="passwordLabel"
                        error={errorPassword}
                        autoComplete="current-password"
                    />
                    <HelperText accessibilityLiveRegion="polite" type="error">{pswErrorMsg}</HelperText>
                </View>
                <View>
                    <Button
                        onPress={() => fastLogin()}
                    >Fast login </Button>
                    <Button
                        mode="contained"
                        buttonColor="#874CCC"
                        onPress={() => handleLogIn()}
                    >Login</Button>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('SignUp')}
                    >Sign up</Button>
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
        paddingBottom: 10,
        width: '75%'
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