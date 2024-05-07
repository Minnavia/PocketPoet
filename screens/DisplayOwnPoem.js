import { ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { db } from "../firebase.config";
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";
import { useAuth } from "../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-get-random-values';

export default function DisplayOwnPoem({ route, navigation }) {

    const {poem} = route.params;

    const {user} = useAuth();

    const [visible, setVisible] = useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const deletePoem = () => {
        try {
            remove(ref(db, `users/${user.uid}/poems/${poem.id}`));
        } catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        
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
                    <Text style={{fontSize: 15}}>{poem.title}</Text>
                    <Text style={{fontSize: 14}}>{poem.author}</Text>
                </View>
                <View>
                    <IconButton 
                            icon='delete'
                            animated={true}
                            size={30}
                            rippleColor={'pink'}
                            onPress={() => showDialog()}
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
            <Portal>
                <Dialog visible={visible} onDismiss={() => hideDialog()}>
                    <Dialog.Content>
                        <Text>Delete this poem?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => hideDialog()}>Cancel</Button>
                        <Button onPress={() => {deletePoem(), navigation.navigate('Fav')}}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    )
};

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
        paddingHorizontal: 10
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
        marginTop: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
        paddingVertical: 20,
        marginBottom: 20
    },
    listItem: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 10,
    }
  });  