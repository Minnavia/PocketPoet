import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth, db } from "../firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function SignUp({navigation}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const {user} = useAuth();

    const handleSignUp = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {displayName: name})
            .then(userToDB())
        } catch(error) {
            setError(error.message);
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
                />
            </View>
            <View style={styles.section}>
                <Text>Email</Text>
                <TextInput 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                />
            </View>
            <View style={styles.section}>
                <Text>Password</Text>
                <TextInput 
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    textContentType="password"
                    showSoftInputOnFocus={false}
                    activeUnderlineColor="#874CCC"
                    underlineColor="#BEADFA"
                />
                <Text>{error}</Text>
            </View>
                <Button 
                    mode="contained"
                    buttonColor="#874CCC"
                    rippleColor='#BEADFA'
                    onPress={() => handleSignUp()}
                >Sign up</Button>
                <Button
                    onPress={() => navigation.navigate('Login')}
                >Already have an account?</Button>
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
    }
  });  