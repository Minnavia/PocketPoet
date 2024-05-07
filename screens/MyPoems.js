import { db } from "../firebase.config";
import { FlatList, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { List, SegmentedButtons, Text } from "react-native-paper";
import { onValue, ref } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function MyPoems({navigation}){

    const {user} = useAuth();

    const [screenShown, setScreenShown] = useState('own');
    const [myPoems, setMyPoems] = useState([]);
    const [hasPoems, setHasPoems] = useState(false);

    const getMyPoems = () => {
        try {
            const ownRef = ref(db, `users/${user.uid}/poems/`);
            onValue(ownRef, (snapshot) => {
                if (snapshot.val() === null) {
                    setHasPoems(false);
                } else {
                    const data = snapshot.val();
                    setMyPoems(Object.values(data));
                    setHasPoems(true);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMyPoems();
    }, [])

    renderItem = ({item}) => (
        <View style={styles.listItem}>
            <List.Item
                title={item.title}
                description={item.author}
                onPress={() => {
                    console.log(item);
                    navigation.navigate('ReadOwn', {poem: item})}}
            />
        </View>
    );

    return(
        <View style={styles.container}>
            <View style={styles.buttons}>
                <SegmentedButtons 
                    value={screenShown}
                    onValueChange={setScreenShown}
                    buttons={[
                        {
                            value: 'fav',
                            label: 'Favourites',
                            onPress: (() => navigation.navigate('Fav')),
                            style: {
                                backgroundColor: '#fff'
                            }
                        },
                        {
                            value: 'own',
                            label: 'My poems',
                            style: {
                                backgroundColor: '#D0BFFF'
                            }
                        }
                    ]}
                />
            </View>
            <View style={styles.list}>
                {hasPoems ? <FlatList 
                    data={myPoems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                /> : <Text>Nothing here</Text>}
            </View>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DFCCFB',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    list: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
        marginBottom: 20
    },
    listItem: {
        flex: 1,
    }
});