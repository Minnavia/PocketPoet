import { BlockquoteBridge, BoldBridge, ItalicBridge, RichText, StrikeBridge, Toolbar, useEditorBridge, useEditorContent } from "@10play/tentap-editor";
import React, { useEffect } from "react";
import { useState } from "react";
import { Platform, KeyboardAvoidingView, Button, StyleSheet, Text, View } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase.config";
import { push, ref } from "firebase/database";
import { useAuth } from "../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WritePoem({navigation}) {

    const {user} = useAuth();

    const [poem, setPoem] = useState({
        title: '',
        author: '',
        lines: [],
    });

    const [lines, setLines] = useState('');

    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent,
        /*bridgeExtensions: [
            BlockquoteBridge,
            ItalicBridge,
            BoldBridge,
            StrikeBridge,
        ]*/
    });

    const initialContent = `<p>This is a basic example!</p>`;
    const content = useEditorContent(editor, {type: 'html'});

    const saveLines = () => {
        setLines(content.toString());
    };

    useEffect(() => {
        content && saveLines(content);
    }, [content]);

    const savePoem = () => {
        const array = lines.replace(/<p>/g, '').split('</p>');
        const arr = array.reduce(function(array, content) {
            array.push({id: uuidv4(), line: content});
            return array;
        }, []);
        console.log(arr);
        setPoem({author: user.displayName, title: 'jotain', lines: arr})
        push(ref(db, `users/${user.uid}/poems/`), {author: user.displayName, title: 'jotain', lines: arr});
        console.log(poem);
    };

    const submitPoem = () => {
        navigation.navigate('PocketPoet', {screen: 'Poem', params: {poem: poem}})
    };

    return (
        <SafeAreaView style={styles.editor}>
            <RichText editor={editor} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.KeyboardAvoidingView}>
                <Toolbar editor={editor}/>
            </KeyboardAvoidingView>
            <Button title='save' onPress={()=> {savePoem()}}></Button>
            <Button title='Read' onPress={() => {submitPoem()}}></Button>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editor: {
        flex: 1,
    },
    keyboardAvoidingView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
});  