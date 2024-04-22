import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase.config";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Button, List } from "react-native-paper";
import { onValue, ref } from "firebase/database";

export default function Favourites({navigation}){

    const user = auth.currentUser;

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
            right={item => <Button onPress={() => navigation.navigate('Poem', {poem: item})}>read</Button>}
        />
    );

    return(
        <SafeAreaView>
            <FlatList 
                data={favourites}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
            />
        </SafeAreaView>
    )
}