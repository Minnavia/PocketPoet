import { useState } from "react";
import { StyleSheet, View, Button, FlatList, findNodeHandle, Pressable } from "react-native";
import { SegmentedButtons, List, Text, Searchbar, TextInput } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from "react-native-safe-area-context";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchPoems({navigation}) {

    const [search, setSearch] = useState('');
    const [option, setOption] = useState('');
    
    const [totalItems, setTotalItems] = useState(0);
    const [pageData, SetPageData] = useState([]);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(false);

    const listSize = 7;
    const from = page * listSize;
    const to = (page + 1) * listSize;

    function splitIntoChunks(arr, chunkSize) {
        if (chunkSize <= 0) throw 'Invalid Chunk size';
        let result = [];
        for (let i = 0, len = arr.length; i < len; i += chunkSize)
          result.push(arr.slice(i, i + chunkSize));
        console.log(result[0].length);
        return result;
    };

    const handleData = (newData) => {
        SetPageData(splitIntoChunks(newData, listSize));
        console.log("should be on page", pageData)
    };

    const generateRandomRequests = () => {
        var requests = []
        for (let i = 0; i < 5; i++) {
            requests.push(`https://poetrydb.org/random`);
        }
        console.log('requests ', requests);
        return requests;
    };

    const updatePoems = (dayChange) => {
        console.log('Fetching poems.');
        var newData = []
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
            console.log("first data?", data[0])
            data = data.map(object => {
                var arr = object[0].lines.reduce(function(array, content) {
                    array.push({id: uuidv4(), line: content});
                    return array;
                }, []);
                newData.push({id: uuidv4(), author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr})
            })
            console.log("newdata", newData)
            setTotalItems(newData.length)
            handleData(newData)
        })
        .catch(function (error) {
            console.log(error);
        })
        };

    const getRandomResults = () => {
        setPage(0);
        fetch(`https://poetrydb.org/random`)
        .then(response => {response.json(); console.log(response)})
        .then(function (data) {
            console.log("data before newdata", data);
            setError(false);
            var newData = [];
            data.map(object => {
                newData.push({id: uuidv4(), author: object.author, title: object.title, linecount: object.linecount, lines: object.lines});
            });
            setTotalItems(newData.length);
            handleData(newData);
        })
        .catch((error) => {
            console.log(error);
            setError(true);
        })
    }

    //Does not work: PoetryDB returns an application error
    const getResults = () => {
        setPage(0);
        fetch(`https://poetrydb.org/${option}/${search}`)
        .then(response => {response.json()})
        .then(function (data) {
            setError(false);
            var newData = [];
            data.map(object => {
                newData.push({id: uuidv4(), author: object.author, title: object.title, linecount: object.linecount, lines: object.lines});
            });
            setTotalItems(newData.length);
            handleData(newData);
        })
        .catch((error) => {
            console.log(error);
            setError(true);
        })
    };

    const makeIDs = (item) => {
        var arr = item.lines.reduce(function(array, content) {
            array.push({id: uuidv4(), line: content});
            return array;
        }, []);
        return ({id: item.id, title: item.title, author: item.author, lines: arr});
    };

    const nextPage = () => {
        if (page < Math.floor(totalItems / listSize)) {
            setPage(page + 1);
        } else {
            setPage(page);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        } else {
            setPage(0);
        }
    };

    const renderItem = ({item}) => (
            <List.Item
                title={item.title}
                description={item.author}
                onPress={() => {
                    console.log(item);
                    navigation.navigate('Read', {poem: item})
                }}
            />
    );

    const getButtonStyle = (value) => {
        if(option == value) {
            return {
                backgroundColor: '#e47cdbff'
            }
        } else {
            return {
                backgroundColor: '#ffff'   
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flex}>
            {option == "" ?
                <View>
                    <List.Section>
                        <List.Subheader>Search for</List.Subheader>
                        <List.Item
                            title="Author"
                            onPress={() => setOption("author")}
                        />
                        <List.Item
                            title="Title"
                            onPress={() => setOption("title")}
                        />
                        <List.Item
                            title="Lines"
                            onPress={() => setOption("lines")}
                        />
                    </List.Section>
                </View>
            :
            <>
                <View style={styles.flex}>
                    <View style={styles.search}>
                        <View style={styles.button}>
                            <Button
                            title="Back"
                            width="200px"
                            onPress={() => setOption("")}
                            >
                                Back
                            </Button>
                        </View>
                        <View style={styles.bar}>
                            <Searchbar 
                            autoFocus={true}
                            onChangeText={(text) => setSearch(text)}
                            mode="bar"
                            value={search}
                            //icon={'arrow-left'}
                            placeholder={option}
                            loading={false}
                            onIconPress={() => updatePoems()}
                            //onIconPress={() => setOption("")}
                            theme={{colors: {primary: '#874CCC'}}}
                            accessibilityRole="search"
                        />
                        </View>
                    </View>
                    <View style={styles.list}>
                        {error ? <Text>ERROR: Did you select a search term? {search}</Text>
                        : <FlatList
                            data={pageData[page]}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            >
                        </FlatList>}
                    </View>
                </View>
                <View style={styles.pagination}>
                    <Button
                        mode="contained"
                        title="Previous"
                        compact={true}
                        buttonColor="#874CCC"
                        onPress={()=> {prevPage()}}>
                        Previous
                    </Button>
                    <Text 
                        variant='titleMedium' 
                        style={{marginHorizontal: 20}}
                        accessibilityLiveRegion="polite"
                    >{`${from + 1} - ${Math.min(to, totalItems)} of ${totalItems}`}
                    </Text>
                    <Button
                        mode="contained"
                        title="Next"
                        compact={true}
                        buttonColor="#874CCC"
                        onPress={()=>{nextPage()}}>
                        Next
                    </Button>
                </View>
            </>
            }
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFCCFB',
        flex: 1,
        alignItems: 'center'
    },
    flex: {
        flex: 1,
        width: '95%',
        backgroundColor: '#DFCCFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        paddingBottom: 20,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#eb90da',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bar: {
        backgroundColor: '#bcd8ab',
        width: "80%"
    },  
    list: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    button: {
        backgroundColor: '#ffff',
        color: '#ae40a0'
    },
    checkedButton: {
        backgroundColor: '#e995d4ff',
    },
    text: {
        paddingBottom: 20,
        fontSize: 16
    }
});  