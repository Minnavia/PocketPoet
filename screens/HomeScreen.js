import { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import 'react-native-get-random-values';
import { stringify, v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Button, Text } from "react-native-paper";
import { db } from "../firebase.config";
import { ref, onValue, push, remove, set, get } from "firebase/database";
import { auth } from "../firebase.config";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/authContext";
import {experimental_accessibilityOrder} from "react-native";
import GlobalVariables from "../constants/GlobalVariables";

export default function HomeScreen({ navigation }) {

    const [poems, setPoems] = useState([]);
    const {user} = useAuth();
    const [details, setDetails] = useState({});

    //generate random numbers within limits to get poems of varying linecounts
    //get fetch requests
    const generateRequests = () => {
        var linecounts = []
        for (let i = 0; i < details.poemCount; i++) {
            linecounts.push(Math.floor(Math.random() * (details.max - details.min + 1)) + details.min);
        }
        console.log('Linecounts ', linecounts);
        return linecounts.map(linecount => `https://poetrydb.org/random,linecount/1;${linecount}`)
    };

    //generate random requests with no linecount limits
    const generateRandomRequests = () => {
        var requests = []
        for (let i = 0; i < details.poemCount; i++) {
            requests.push(`https://poetrydb.org/random`);
            console.log(details.poemCount);
        }
        console.log('requests ', requests);
        return requests;
    };

    //check if the day has changed
    const hasDayChanged = (date) => {
        const dataDate = new Date(date);
        const nowDate = new Date();
        console.log('data ', dataDate);
        console.log('now ', nowDate);
        if (
            nowDate.getFullYear() === dataDate.getFullYear() &&
            nowDate.getMonth() === dataDate.getMonth() &&
            nowDate.getDate() === dataDate.getDate()
        ) {
            console.log("Day hasn't changed");
            updatePoems(false);
        } else {
            console.log('Day has changed');
            set(ref(db, `users/${user.uid}/date`), JSON.stringify(nowDate));
            updatePoems(true);
        }
    };

    //fetch new daily poems from API if the day has changed
    const updatePoems = (dayChange) => {
        if (dayChange === true) {
            console.log('Fetching poems.');
            const endpoints = generateRandomRequests();
            console.log("random poems ", endpoints);
            const fetchPromises = endpoints.map(endpoint => fetch(endpoint));
            Promise.all(fetchPromises)
            .then(function (responses) {
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            })
            .then(function (data) {
                console.log("Data before mapping", data)
                data = data.map(object => {
                    var arr = object[0].lines.reduce(function(array, content) {
                        array.push({id: uuidv4(), line: content});
                        return array;
                    }, []);
                    return({id: uuidv4(), author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr})
                })
                set(ref(db, `users/${user.uid}/dailies/`), data);
                getPoemsFromDB();
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            getPoemsFromDB();
        }
    };

    const getPoemsFromDB = () => {
        console.log('Getting poems from DB');
        try {
            const dailiesRef = ref(db, `users/${user.uid}/dailies/`);
            onValue(dailiesRef, (snapshot) => {
                if(snapshot.val() === null) {
                    console.log('nothing yet')
                } else {
                    const data = snapshot.val();
                    setPoems(Object.values(data));
                }
            });
        } catch {
            updatePoems(true);
        }
    };

    const getDetails = (refresh) => {
        try {
            const detailsRef = ref(db, `users/${user.uid}/details`);
            onValue(detailsRef, (snapshot) => {
                if(snapshot.val() === null) {
                    console.log('data snapshot null');
                } else {
                    const data = snapshot.val();
                    console.log(data);
                    setDetails(data);
                }
            })
            get(ref(db, `users/${user.uid}/dailies/`))
            .then((snapshot) => {
            if (snapshot.val() === null || refresh === true) {
                console.log('nothing here, new account?', snapshot.val())
                updatePoems(true);
            } else {
                try {
                    get(ref(db, `users/${user.uid}/date`))
                    .then((snapshot) => {
                        console.log('checking date');
                        hasDayChanged(JSON.parse(snapshot.val()));
                    })
                } catch(error) {
                    console.log(error);
                }
            }})
        } catch(error) {
            console.log(error);
        }
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDetails();
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const renderItem = ({item}) => (
        <View style={styles.listItem}>
            <List.Item
                title={item.title}
                description={item.author}
                onPress={() => {
                    console.log(item);
                    navigation.navigate('Read', {poem: item})}}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} experimental_accessibilityOrder={['list', 'button', 'header']}>
            {loading ? (
                <ActivityIndicator size='large' color='#0000ff'/>
            ) : (
                <>
                    <View nativeID="header">
                        <Text style={{fontSize: 18}}>Your daily poems, {details.name}:</Text>
                    </View>
                    {poems.length === 0 ?
                    <View style={styles.list} nativeID="button">
                        <Button onPress={() => updatePoems(true)}>Fetch your first poems!</Button>
                    </View>
                    : <View style={styles.list} nativeID="list">
                        <FlatList
                            data={poems}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                        <Button onPress={() => getDetails(true)}>Refresh</Button>
                    </View>}
                </>
                )
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DFCCFB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        flex: 1,
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 10,
        padding: 10,
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#D0BFFF',
    },
    list: {
        flex: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '85%',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
        paddingBottom: 20
    },
    listItem: {
        flex: 1,
        backgroundColor: '#FFF3DA',
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
  });