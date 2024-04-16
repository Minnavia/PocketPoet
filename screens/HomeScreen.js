import { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, Button, Alert } from "react-native";
import 'react-native-get-random-values';
import { stringify, v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List } from "react-native-paper";
import { db } from "../firebase.config";
import { ref, onValue, push, remove } from "firebase/database";

export default function HomeScreen({ navigation }) {

    const [poems, setPoems] = useState([]);

    //generate random numbers within limits to get poems of varying linecounts
    //get fetch requests
    const generateRequests = () => {
        const min = 5;
        const max = 15;
        const poemCount = 3;
        const linecounts = [];
        for (let i = 0; i < poemCount; i++) {
            linecounts.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return linecounts.map(linecount => `https://poetrydb.org/random,linecount/1;${linecount}`)
    };

    //check if the day has changed

    const getDate = () => {
        try {
            const dateRef = ref(db, 'date/');
            onValue(dateRef, (snapshot) => {
                const data = snapshot.val();
                const date = JSON.parse(Object.values(data));
                hasDayChanged(new Date(date));
            })
        } catch (error) {
            console.log('error')
            Alert.alert(error.message);
        }
    };

    const hasDayChanged = (dataDate) => {
        console.log('this aint kansas anymore', dataDate);
        const nowDate = new Date();
        console.log('data ', dataDate);
        console.log('now ', nowDate);
        if (
            nowDate.getFullYear() === dataDate.getFullYear() &&
            nowDate.getMonth() === dataDate.getMonth() &&
            nowDate.getDate() === dataDate.getDate()
        ) {
            console.log('it today');
            updatePoems(false);
        } else {
            console.log('tis some other time');
            updatePoems(true);
        }
    };

    //fetch new daily poems from API if the day has changed
    const updatePoems = (dayChange) => {
        console.log(dayChange);
        if (dayChange === true) {
            console.log('As you wish... have ur poems');
            const clearRef = ref(db, 'dailies/');
            clearRef.remove();
            const endpoints = generateRequests();
            const fetchPromises = endpoints.map(endpoint => fetch(endpoint));
            Promise.all(fetchPromises)
            .then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            })
            .then(function (data) {
                data.map(object => {
                    var arr = object[0].lines.reduce(function(array, content) {
                        array.push({id: uuidv4(), line: content});
                        return array;
                    }, []);
                    console.log('reached here')
                    push(ref(db, 'dailies/'), {author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr});
                })
            })
            .catch(function (error) {
                console.log(error);
            })
        }
        else {
            const dailiesRef = ref(db, 'dailies/');
            onValue(dailiesRef, (snapshot) => {
                const data = snapshot.val();
                setPoems(Object.values(data));
            })
            console.log('all quiet on the western front');
    }};

    useEffect(() => {
        getDate();
    }, []);

    renderItem = ({item}) => (
        <List.Item
            title={item.title}
            description={item.author}
            right={item => <Button title='Read' onPress={() => navigation.navigate('Poem', {poem: item})}></Button>}
        />
    );

    return (
        <View style={styles.container}>
            <Text>PocketPoet</Text>
            <FlatList
                data={poems}
                renderItem={({item}) =>
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Button title='Read' onPress={() => navigation.navigate('Poem', {poem: item})}></Button>
                </View>}
            >
            </FlatList>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });  