import { useState, useEffect } from "react";
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
    const {user} = useAuth();

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

    const clearPoems = () => {
        const clearRef = ref(db, `users/${user.uid}/dailies/`);
        remove(clearRef);
        console.log('removed old ones');
        updatePoems(true);
    };

    //check if the day has changed

    const getDate = async () => {
        console.log('getdate ', user.uid);
        get(ref(db, `users/${user.uid}/dailies/`))
        .then((snapshot) => {
            if(snapshot.val() === null) {
                console.log('doesnt exist');
                updatePoems(true);
            } else {
                console.log('exists');
                try {
                    const dateRef = ref(db, `users/${user.uid}/date/`);
                    onValue(dateRef, (snapshot) => {
                        const data = snapshot.val();
                        const dataDate = JSON.parse(data);
                        if (dataDate === NaN) {
                            console.log('NAN ALERT');
                        } else {
                            console.log('datadate ', new Date(dataDate));
                            hasDayChanged(new Date(dataDate));
                        }
                    })
                } catch (error) {
                    console.log('error')
                    Alert.alert(error.message)
                    //var nowDate = new Date();
                    //push(ref(db, 'date/'), JSON.stringify(new Date());
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const hasDayChanged = (dataDate) => {
        console.log('this aint kansas anymore', dataDate);
        if (dataDate === NaN) {
            console.log('NAN ALERT');
        } else {
            const nowDate = new Date();
            console.log('data ', dataDate);
            console.log('now ', nowDate);
            if (typeof dataDate === 'string' || dataDate instanceof String){
                console.log('it string');
            }
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
                clearPoems();
            }
        }
    };

    //fetch new daily poems from API if the day has changed
    const updatePoems = (dayChange) => {
        console.log(dayChange);
        if (dayChange === true) {
            console.log('As you wish... have ur poems');
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
                    console.log('reached here');
                    push(ref(db, `users/${user.uid}/dailies/`), {author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr});
                })
                getPoemsFromDB();
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            console.log('all quiet on the western front');
            getPoemsFromDB();
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
        console.log('homescreen', user.uid)
        //set(ref(db, `users/${user.uid}/test`), 'testi');
        getDate();
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
                renderItem={({item}) =>
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Button title='Read' onPress={() => navigation.navigate('Poem', {poem: item})}>READ</Button>
                </View>}
            >
            </FlatList>
            <Button onPress={() => navigation.navigate('Favourites')}>Favourites</Button>
            <Button onPress={() => updatePoems(true)}>Refresh</Button>
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