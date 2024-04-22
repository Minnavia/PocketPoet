import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { auth, db } from "../firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { child, ref, set } from "firebase/database";


export default function SignUp({navigation}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {displayName: name})
            .then(
                userToDB()
            );
        } catch(error){
            console.log(error);
        }
    }

    const userToDB = () => {
        console.log('at db');
        user = auth.currentUser;
        set(ref(db, `users/${user.uid}`), {
            name: name,
            email: email,
        });
    }

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