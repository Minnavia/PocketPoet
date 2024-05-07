import { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Button, IconButton, Menu } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPoems({navigation}) {

    const [search, setSearch] = useState('');
    const [option, setOption] = useState('none selected');
    const [totalItems, setTotalItems] = useState(0);
    const [pageData, SetPageData] = useState([]);
    const [page, setPage] = useState(0);
    const [error, setError] = useState(false);

    const [placeholder, setPlaceholder] = useState("Select search term.");
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const listSize = 7;
    const from = page * listSize;
    const to = (page + 1) * listSize;

    const getResults = () => {
        setPage(0);
        fetch(`https://poetrydb.org/${option}/${search}`)
        .then(response => response.json())
        .then(function (data) {
            setError(false);
            console.log('trying to get data');
            newData = [];
            data.map(object => {
                newData.push({id: uuidv4(), author: object.author, title: object.title, linecount: object.linecount, lines: object.lines});
            });
            console.log('data map success', newData.length);
            setTotalItems(newData.length);
            handleData(newData);
        })
        .catch((error) => {
            console.log(error);
            setError(true);
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
            <View style={styles.search}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    contentStyle={{marginTop: 50, marginLeft: 20}}
                    anchor={
                        <Searchbar 
                            placeholder={placeholder}
                            onChangeText={setSearch}
                            mode="bar"
                            right={(props) => <IconButton icon='magnify' size={24} onPress={() => getResults()}/>}
                            onTraileringIconPress={() => getResults()}
                            icon={'menu'}
                            onIconPress={openMenu}
                            value={search}
                            theme={{colors: {primary: '#874CCC'}}}
                        />}
                >
                    <Menu.Item 
                        title='Author'
                        onPress={() => {setOption('author'), setPlaceholder('Author'), closeMenu()}}
                    />
                    <Menu.Item 
                        title='Title'
                        onPress={() => {setOption('title'), setPlaceholder('Title'), closeMenu()}}
                    />
                    <Menu.Item 
                        title='Lines'
                        onPress={() => {setOption('lines'), setPlaceholder('Lines'), closeMenu()}}
                    />
                </Menu>
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
        flex: 1,
        backgroundColor: '#DFCCFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    search: {
        width: '85%',
        paddingBottom: 20,
    },  
    list: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        width: '85%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    }
});  