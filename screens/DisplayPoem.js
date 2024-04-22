import { push, ref } from "firebase/database";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../firebase.config";
import { Button } from "react-native-paper";

export default function DisplayPoem({ route, navigation }) {

    const {poem} = route.params;

    const user = auth.currentUser;

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text>{item.line}</Text>
        </View>
    );

    const setFavourite = () => {
        try {
            push(ref(db, `users/${user.uid}/favourites/`), poem);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Looking at a poem</Text>
                <Text>{poem.title}</Text>
                <Text>{poem.author}</Text>
                <Button onPress={() => setFavourite()}>Favourite</Button>
                <FlatList
                    data={poem.lines}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                ></FlatList>
        </View>
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