import { get, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { db } from "../firebase.config";
import { IconButton, Text } from "react-native-paper";
import { useAuth } from "../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-get-random-values';
import GlobalStyles from "../constants/GlobalStyles";

export default function DisplayPoem({ route, navigation }) {

    const {poem} = route.params;

    const {user} = useAuth();

    const [isFavourite, setIsFavourite] = useState(false);

    function checkFav() {
        get(ref(db, `users/${user.uid}/favourites/${poem.id}`))
        .then((snapshot) => {
            if (snapshot.val() === null){
                setIsFavourite(false);
            } else {
                setIsFavourite(true);
            }
        })
    };

    const setFavourite = () => {
        if (isFavourite === false) {
            try {
                setIsFavourite(true);
                set(ref(db, `users/${user.uid}/favourites/${poem.id}`),  poem);
            } catch(error) {
                console.log(error);
            }
        } else {
            try {
                setIsFavourite(false);
                remove(ref(db, `users/${user.uid}/favourites/${poem.id}`));
            } catch(error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        checkFav();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text>{item.line}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.title}>
                    <Text>{poem.title}</Text>
                    <Text>{poem.author}</Text>
                </View>
                <View>
                    <IconButton 
                            icon='heart'
                            animated={true}
                            size={30}
                            selected={isFavourite}
                            theme={{colors: {primary: '#874CCC', onSurfaceVariant: '#BEADFA'}}}
                            rippleColor={'pink'}
                            onPress={() => setFavourite()}
                    >Favourite</IconButton>
                </View>
            </View>
            <View style={styles.list}>
                <FlatList
                    data={poem.lines}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                ></FlatList>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DFCCFB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    banner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
        paddingHorizontal: 10,

    },
    title: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        flex: 6,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '85%',
        borderWidth: 3,
        borderColor: '#D0BFFF',
        marginTop: 10,
        borderRadius: 20,
        paddingVertical: 20,
        rowGap: 10,
        marginBottom: 20
    },
    listItem: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 10,
    }
  });  