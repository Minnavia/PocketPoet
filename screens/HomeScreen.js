import { useState, useEffect, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Alert } from "react-native";
import 'react-native-get-random-values';
import { stringify, v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Button } from "react-native-paper";
import { db } from "../firebase.config";
import { ref, onValue, push, remove, set, get } from "firebase/database";
import { auth } from "../firebase.config";
import { SafeAreaView } from "react-native-safe-area-context";
import UpdatePoems from "../components/updatePoems";
import { useAuth } from "../contexts/authContext";

export default function HomeScreen({ navigation }) {

    const [poems, setPoems] = useState([]);
    const {user, details, date} = useAuth();

    //generate random numbers within limits to get poems of varying linecounts
    //get fetch requests
    const generateRequests = () => {
        console.log('requests');
        var linecounts = []
        console.log('detailssss ', details);
        for (let i = 0; i < details.poemCount; i++) {
            linecounts.push(Math.floor(Math.random() * (details.max - details.min + 1)) + details.min);
        }
        console.log('LINECOUNTS', linecounts);
        return linecounts.map(linecount => `https://poetrydb.org/random,linecount/1;${linecount}`)
    };

    //check if the day has changed
    const hasDayChanged = (date) => {
        const dataDate = new Date(date);
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
            set(ref(db, `users/${user.uid}/date`), JSON.stringify(nowDate));
            updatePoems(true);
        }
    };

    //fetch new daily poems from API if the day has changed
    const updatePoems = async (dayChange) => {
        console.log(dayChange);
        if (dayChange === true) {
            console.log('As you wish... have ur poems');
            const endpoints = await generateRequests();
            const fetchPromises = endpoints.map(endpoint => fetch(endpoint));
            Promise.all(fetchPromises)
            .then(function (responses) {
                console.log('promise');
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            })
            .then(function (data) {
                data = data.map(object => {
                    var arr = object[0].lines.reduce(function(array, content) {
                        array.push({id: uuidv4(), line: content});
                        return array;
                    }, []);
                    return({id: uuidv4(),author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr})
                })
                set(ref(db, `users/${user.uid}/dailies/`), data);
                console.log('end', data);
                getPoemsFromDB();
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            get(ref(db, `users/${user.uid}/dailies/`))
            .then((snapshot) => {
            if (snapshot.val() === null) {
                console.log('doesnt exist');
                updatePoems(true);
            } else {
                console.log('exists');
                console.log('all quiet on the western front');
                getPoemsFromDB();
            }})
        }
    };

    const getPoemsFromDB = () => {
        console.log('putting stuff on screen');
        try {
            const dailiesRef = ref(db, `users/${user.uid}/dailies/`);
            onValue(dailiesRef, (snapshot) => {
                const data = snapshot.val();
                setPoems(Object.values(data));
            });
        } catch {
            console.log('no poems');
        }
    }

    useEffect(() => {
        //set(ref(db, `users/${user.uid}/test`), 'testi');
        console.log('DETAILS ', details);
        console.log('DATE ', date)
        hasDayChanged(date);
        //updatePoems(true);
    }, []);

    renderItem = ({item}) => (
        <List.Item
            title={item.title}
            description={item.author}
            right={item => <Button onPress={() => navigation.navigate('Poem', {poem: item})}>read</Button>}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text>PocketPoet {user.uid}</Text>
            <FlatList
                data={poems}
                keyExtractor={(item) => item.id}
                renderItem={({item}) =>
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Button title='Read' onPress={() => navigation.navigate('Poem', {poem: item})}>READ</Button>
                </View>}
            >
            </FlatList>
            <Button onPress={() => navigation.navigate('Favourites')}>Favourites</Button>
            <Button onPress={() => navigation.navigate('Profile')}>Profile</Button>
            <Button onPress={() => updatePoems(true)}>Refresh</Button>
            <Button onPress={() => forceUpdate}>rerender</Button>
            <Button onPress={() => auth.signOut()}>Log out</Button>
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
  });  