import { useState } from "react";
import { Alert, Pressable, StyleSheet, View, Text, FlatList } from "react-native";
import { Button, RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import { List } from 'react-native-paper';
import 'react-native-get-random-values';
import { stringify, v4 as uuidv4 } from 'uuid';

export default function SearchPoems({navigation}) {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [option, setOption] = useState('none selected');

    const getResults = () => {
        fetch(`https://poetrydb.org/${option}/${search}`)
        .then(response => response.json())
        .then(function (data) {
            newData = [];
            data.map(object => {
                newData.push({id: uuidv4(), author: object.author, title: object.title, linecount: object.linecount, lines: object.lines});
            })
            setResults(newData);
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
        <View style={styles.container}>
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
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                >
            </FlatList>
            </View>
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
    radiobuttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
    },
    list: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        width: '100%'
    }
});  