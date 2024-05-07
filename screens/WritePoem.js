import React, { useEffect } from "react";
import { useState } from "react";
import { Platform, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase.config";
import { ref, set } from "firebase/database";
import { useAuth } from "../contexts/authContext";
import { Button, TextInput } from "react-native-paper";
import { RichEditor } from "react-native-pell-rich-editor";

export default function WritePoem({ navigation}) {

    const {user} = useAuth();

    const [poem, setPoem] = useState({
        title: '',
        author: '',
        lines: [],
        id: '',
    });
    const [title, setTitle] = useState('');

    const [lines, setLines] = useState('');

    const savePoem = () => {
        const array = lines.replace(/<div>/g, '').split('</div>');
        let arr = array.reduce(function(array, content) {
            array.push({id: uuidv4(), line: content});
            return array;
        }, []);
        var id = uuidv4();
        setPoem({...poem, id: id, title: title, author: user.displayName, lines: arr})
        set(ref(db, `users/${user.uid}/poems/${id}`), {id: id, title: title, author: user.displayName, lines: arr});
        this.RichText.setContentHTML('');
        setPoem();
        setTitle('');
    };

    const submitPoem = () => {
        navigation.navigate('Read', {poem: poem})
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <TextInput 
                    value={title}
                    label="Title"
                    style={{fontSize: 18, paddingLeft: 20, height: 60}}
                    onChangeText={(text) => setTitle(text)}
                />
            </View>
            <View style={styles.editor}>
                <RichEditor
                    ref={(r) => this.RichText = r}
                    useContainer= {false}
                    placeholder="Write your own poem!"
                    onChange={(text) => setLines(text.toString())}
                />
            </View>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.buttons}>
                <Button mode="contained" onPress={() => {submitPoem()}}>Preview</Button>
                <Button mode="contained" onPress={()=> {savePoem(), navigation.navigate('Favourites', {screen: 'Own'})}}>Save</Button>
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    title: {
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 15,
        width: '85%'
    },
    container: {
        flex: 1,
        backgroundColor: '#DFCCFB',
    },
    editor: {
        flex: 6,
        marginHorizontal: 30,
        borderWidth: 3,
        borderColor: '#D0BFFF',
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 30,
        marginVertical: 10
    },
});  