import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase.config";
import { FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Button, List } from "react-native-paper";
import { onValue, ref } from "firebase/database";
import { useAuth } from "../contexts/authContext";

export default function Favourites({navigation}){

    const {user} = useAuth();

    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        try {
            const favRef = ref(db, `users/${user.uid}/favourites/`);
            onValue(favRef, (snapshot) => {
                const data = snapshot.val();
                setFavourites(Object.values(data));
            });
        } catch (error) {
            console.log(error);
        }
    }, [])

    renderItem = ({item}) => (
        <List.Item
            title={item.title}
            description={item.author}
            onPress={() => {
                console.log(item);
                navigation.navigate('Poem', {poem: item})}}
        />
    );

    return(
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={favourites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
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