import { useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPoems({navigation}) {

    const [search, setSearch] = useState('');
    const [option, setOption] = useState('none selected');
    const [totalItems, setTotalItems] = useState(0);
    const [pageData, SetPageData] = useState([]);
    const [page, setPage] = useState(0);

    const listSize = 10;
    const from = page * listSize;
    const to = (page + 1) * listSize;

    const getResults = () => {
        fetch(`https://poetrydb.org/${option}/${search}`)
        .then(response => response.json())
        .then(function (data) {
            console.log('trying to get data');
            newData = [];
            data.map(object => {
                newData.push({id: uuidv4(), author: object.author, title: object.title, linecount: object.linecount, lines: object.lines});
            });
            console.log('data map success', newData.length);
            setTotalItems(newData.length);
            handleData(newData);
        })
        .catch(err => {
            console.log(err);
        })
    };

    const makeIDs = (item) => {
        console.log('Trying to id: ', item);
        var arr = item.lines.reduce(function(array, content) {
            array.push({id: uuidv4(), line: content});
            return array;
        }, []);
        return ({id: item.id, title: item.title, author: item.author, lines: arr});
    };

    const handleData = (newData) => {
        console.log('setting page data');
        SetPageData(SplitIntoChunks(newData, listSize));
    };

    function SplitIntoChunks(arr, chunkSize) {
        if (chunkSize <= 0) throw 'Invalid Chunk size';
        let result = [];
        for (let i = 0, len = arr.length; i < len; i += chunkSize)
          result.push(arr.slice(i, i + chunkSize));
        console.log(result[0].length);
        return result;
    };

    const nextPage = () => {
        if (page < Math.floor(totalItems / listSize)) {
            console.log(page, ' smaller than ', Math.floor(totalItems / listSize))
            setPage(page + 1);
        } else {
            console.log('else');
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

    renderItem = ({item}) => (
            <List.Item
                title={item.title}
                description={item.author}
                onPress={() => {
                    console.log(item);
                    navigation.navigate('Read', {poem: makeIDs(item)})}}
            />
    )

    return (
        <SafeAreaView style={styles.container}>
            <Text>User option: {option}</Text>
                <RadioButton.Group onValueChange={newValue => setOption(newValue)} value={option}>
                    <View style={styles.radiobuttons}>
                        <View>
                            <Text>Author</Text>
                            <RadioButton value="author"/>
                        </View>
                        <View>
                            <Text>Title</Text>
                            <RadioButton value="title"/>
                        </View>
                        <View>
                            <Text>Lines</Text>
                            <RadioButton value="lines"/>
                        </View>
                    </View>
                </RadioButton.Group>
            <Searchbar 
                placeholder="search"
                onChangeText={setSearch}
                value={search}
            />
            <Button 
                mode="contained"
                onPress={()=> {getResults()}}
            >Search</Button>
            <View style={styles.list}>
                <FlatList
                    data={pageData[page]}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    >
                </FlatList>
            </View>
            <View style={styles.pagination}>
                <Button
                    onPress={()=> {prevPage()}}>
                    Previous
                </Button>
                <Text>{`${from + 1}-${Math.min(to, totalItems)} of ${totalItems}`}</Text>
                <Button
                    onPress={()=>{nextPage()}}>
                    Next
                </Button>
            </View>
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
    radiobuttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
    },
    list: {
        backgroundColor: 'pink',
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        width: '100%'
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});  