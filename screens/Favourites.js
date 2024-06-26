import { db } from "../firebase.config";
import { FlatList, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { List, SegmentedButtons, Text } from "react-native-paper";
import { onValue, ref } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function Favourites({navigation}){

    const {user} = useAuth();

    const [screenShown, setScreenShown] = useState('fav');
    const [favourites, setFavourites] = useState([]);
    const [hasFavourites, setHasFavourites] = useState(false);

    const getFavourites = () => {
        try {
            const favRef = ref(db, `users/${user.uid}/favourites/`);
            onValue(favRef, (snapshot) => {
                if (snapshot.val() === null) {
                    setHasFavourites(false);
                } else {
                    setHasFavourites(true);
                    const data = snapshot.val();
                    setFavourites(Object.values(data));
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setScreenShown('fav');
        getFavourites();
    }, [])

    renderItem = ({item}) => (
        <List.Item
            title={item.title}
            description={item.author}
            onPress={() => {
                console.log(item);
                navigation.navigate('Read', {poem: item})}}
        />
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
                            style: {
                                backgroundColor: '#D0BFFF'
                                
                            }
                        },
                        {
                            value: 'own',
                            label: 'My poems',
                            onPress: (() => navigation.navigate('Own')),
                            style: {
                                backgroundColor: '#fff'
                            }
                        }
                    ]}
                />
            </View>
            <View style={styles.list}>
                {hasFavourites ? <FlatList 
                    data={favourites}
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
      justifyContent: 'center',
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
    }
});