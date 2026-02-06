import { useState } from "react";
import { StyleSheet, View, FlatList, findNodeHandle, Pressable } from "react-native";
import { Button, SegmentedButtons } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
    };

    const getResults = () => {
        setPage(0);
        fetch(`https://poetrydb.org/${option}/${search}`)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
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
                    navigation.navigate('Read', {poem: makeIDs(item)})}}
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
                <View style={styles.search}>
                    <SegmentedButtons
                        value={option}
                        onValueChange={setOption}
                        buttons={[
                            {
                                value: 'author',
                                label: 'Author',
                                style: getButtonStyle('author'),
                            },
                            {
                                value: 'title',
                                label: 'Title',
                                style: getButtonStyle('title')
                            },
                            {
                                value: 'lines',
                                label: 'Lines',
                                style: getButtonStyle('lines')
                            }
                        ]}
                    />
                </View>
                <View style={styles.search}>
                    <Searchbar 
                        autoFocus={false}
                        onChangeText={setSearch}
                        mode="bar"
                        value={search}
                        onIconPress={() => getResults()}
                        theme={{colors: {primary: '#874CCC'}}}
                    />
                </View>
                <View style={styles.list}>
                    {error ? <Text>ERROR: Did you select a search term?</Text>
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
                    compact={true}
                    buttonColor="#874CCC"
                    onPress={()=> {prevPage()}}>
                    Previous
                </Button>
                <Text variant='titleMedium' style={{marginHorizontal: 20}}>{`${from + 1} - ${Math.min(to, totalItems)} of ${totalItems}`}</Text>
                <Button
                    mode="contained"
                    compact={true}
                    buttonColor="#874CCC"
                    onPress={()=>{nextPage()}}>
                    Next
                </Button>
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
        width: '85%',
        backgroundColor: '#DFCCFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        paddingBottom: 20,
        width: '100%',
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
        backgroundColor: '#ffff'
    },
    checkedButton: {
        backgroundColor: '#e995d4ff',
    },
    text: {
        paddingBottom: 20,
        fontSize: 16
    }
});  