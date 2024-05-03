import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth, db } from "../firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { child, ref, set } from "firebase/database";
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
        console.log('at db');
        const User = auth.currentUser
        set(ref(db, `users/${User.uid}`), {
            date: JSON.stringify(new Date()),
            details: {
                name: name,
                email: email,
                min: 5,
                max: 15,
                poemCount: 3,
                random: false,
            }
        });
        console.log('we did it folks');
    };

    return(
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Text>SignUp</Text>
                <Text>Name</Text>
                <TextInput 
                    value={name}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="name"
                    onChangeText={(text) => setName(text)}
                />
                <Text>Email</Text>
                <TextInput 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                />
                <Text>Password</Text>
                <TextInput 
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    textContentType="password"
                    showSoftInputOnFocus={false}
                />
                <Text>{error}</Text>
                <Button
                    onPress={() => handleSignUp()}
                >Sign up</Button>
                <Button
                    onPress={() => navigation.navigate('Login')}
                >Already have an account?</Button>
            </KeyboardAvoidingView>
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
  });  