import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase.config";
import { FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Button, List, Text } from "react-native-paper";
import { get, onValue, ref } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function Favourites({navigation}){

    const {user} = useAuth();

    const [favourites, setFavourites] = useState([]);
    const [hasFavourites, setHasFavourites] = useState(false);

    const getFavourites = () => {
        try {
            const favRef = ref(db, `users/${user.uid}/favourites/`);
            onValue(favRef, (snapshot) => {
                const data = snapshot.val();
                setFavourites(Object.values(data));
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        get(ref(db, `users/${user.uid}/favourites/`))
            .then((snapshot) => {
            if (snapshot.val() === null) {
                console.log('doesnt exist');
                setFavourites(false);
            } else {
                console.log('exists');
                setHasFavourites(true);
                getFavourites();
            }})
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
        <SafeAreaView style={styles.container}>
            {hasFavourites ? <FlatList 
                data={favourites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            /> : <Text>Nothing here</Text>}
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