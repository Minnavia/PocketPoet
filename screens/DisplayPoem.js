import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function DisplayPoem({ route, navigation }) {

    const {poem} = route.params;

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text>{item.line}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>Looking at a poem</Text>
                <Text>{poem.title}</Text>
                <Text>{poem.author}</Text>
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