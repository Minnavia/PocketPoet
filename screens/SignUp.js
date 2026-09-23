import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { auth, db } from "../firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function SignUp({navigation}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameMsg, setNameMsg] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [pswError, setPswError] = useState(false);
    const [emailMsg, setEmailMsg] = useState('');
    const [pswrMsg, setPswMsg] = useState('');

    const {user} = useAuth();

    const handleSignUp = async() => {
        setNameError(false);
        setNameMsg('');
        setEmailError(false);
        setEmailMsg('');
        setPswError(false);
        setPswMsg('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {displayName: name})
            .then(userToDB());
        } catch(error) {
            if (error.code == "auth/invalid-email") {
                setErrorEmail(true);
                setEmailMsg("Please provide a valid email address in the format name@domain.com")
            }
            if (error.code == "auth/email-already-in-use") {
                setErrorEmail(true);
                setEmailMsg("This email is already in use. Please try another.");
            }
            if (error.code == "auth/missing-password") {
                setPswError(true);
                setPswMsg("Please enter a password.")
            }
            if (error.code == "auth/weak-password") {
                setPswError(true);
                setPswError("Password should be at least 6 characters.");
            }
            console.log('Error: ', error.code);
            console.log("Msg: ", error.message);
        }
    }

    const userToDB = () => {
        const User = auth.currentUser
        set(ref(db, `users/${User.uid}`), {
            date: JSON.stringify(new Date()),
            details: {
                name: name,
                email: email,
                min: 5,
                max: 15,
                poemCount: 3,
            }
        });
    };

    return(
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={{fontSize: 20}}>SignUp</Text>
            <View style={styles.section}>
                <Text>Name</Text>
                <TextInput 
                    value={name}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="name"
                    autoFocus={true}
                    onChangeText={(text) => setName(text)}
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                    error={nameError}
                />
                <HelperText type="error" accessibilityLiveRegion="polite">{nameMsg}</HelperText>
            </View>
            <View style={styles.section}>
                <Text nativeID="emailLabel">Email</Text>
                <TextInput 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                    accessibilityLabelledBy="emailLabel"
                    error={emailError}
                />
                <HelperText type="error" accessibilityLiveRegion="polite">{emailMsg}</HelperText>
            </View>
            <View style={styles.section}>
                <Text nativeID="passwordLabel">Password</Text>
                <TextInput 
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    textContentType="password"
                    showSoftInputOnFocus={false}
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                    accessibilityLabelledBy="passwordLabel"
                    error={pswError}
                />
                <HelperText type="error" accessibilityLiveRegion="polite">{pswrMsg}</HelperText>
            </View>
                <Button 
                    mode="contained"
                    buttonColor="#874CCC"
                    rippleColor='#BEADFA'
                    onPress={() => handleSignUp()}
                >Sign up</Button>
                <Button
                    onPress={() => navigation.navigate('Login')}
                >Return to login</Button>
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
        width: '75%',
        paddingBottom: 10
    }
  });  