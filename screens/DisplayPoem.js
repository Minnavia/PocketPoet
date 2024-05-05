import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase.config";
import { IconButton } from "react-native-paper";
import { useAuth } from "../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-get-random-values';

export default function DisplayPoem({ route, navigation }) {

    const {poem} = route.params;

    const {user} = useAuth();

    const [isFavourite, setIsFavourite] = useState(false);

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text>{item.line}</Text>
        </View>
    );

    function checkFav() {
        get(ref(db, `users/${user.uid}/favourites/${poem.id}`))
        .then((snapshot) => {
            if (snapshot.val() === null){
                console.log('does not exist!');
                setIsFavourite(false);
                return false;
            } else {
                console.log('exists');
                setIsFavourite(true);
                return true;
            }
        })
    };

    const setFavourite = () => {
        if (isFavourite === false) {
            try {
                set(ref(db, `users/${user.uid}/favourites/${poem.id}`),  poem);
            } catch(error) {
                console.log(error);
            }
        } else {
            console.log('already in favourites');
        }
    };

    useEffect(() => {
        checkFav();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Looking at a poem</Text>
                <Text>{poem.title}</Text>
                <Text>{poem.author}</Text>
                <IconButton 
                    icon='heart'
                    animated={true}
                    onPress={() => setFavourite()}
                    >Favourite</IconButton>
                <FlatList
                    data={poem.lines}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                ></FlatList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20,
    },
    listItem: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
  });  