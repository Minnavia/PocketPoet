import { useEffect, useState } from "react"
import { Alert, Modal, StyleSheet, View } from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase.config";
import { useAuth } from "../contexts/authContext";
import { Button, Divider, List, TextInput, Text } from "react-native-paper";
import { updateEmail, updatePassword, getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "../constants/GlobalStyles";
import GlobalVariables from "../constants/GlobalVariables";


export default function Profile () {

    const auth = getAuth();

    const {user} = useAuth();

    const [details, setDetails] = useState({});

    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState({
        name: '',
        value: '',
        explanation: ''
    });
    const [edit, setEdit] = useState('');
    const [error, setError] = useState(false);

    const changeEmail = () => {
        updateEmail(auth.currentUser, edit)
        .then(() => {
            set(ref(db, `users/${user.uid}/details/${editable.name}`), edit);
            console.log('email updated!');
        })
        .catch((error) => {
            Alert.alert(error.message);
            console.log(error);
        });
    };

    const changePassword = () => {
        updatePassword(auth.currentUser, edit)
        .then(() => {
            console.log('password changed!');
        })
        .catch((error) => {
            Alert.alert(error.message);
            console.log(error);
        });
    }

    const showDialog = (n, val, exp) => {
        GlobalVariables.openModal;
        setEditable({name: n, value: val, explanation: exp});
        setVisible(true);
    };

    const hideDialog = () => {
        GlobalVariables.openModal;
        setVisible(false);
    };


    const hasNumericErrors = () => {
        return Number(edit) > 0 && Number.isInteger(Number(edit)) ? false : true;
    };


    const editDetails = () => {
        set(ref(db, `users/${user.uid}/details/${editable.name}`), Number(edit));
    };

    useEffect(() => {
        try {
            const detailsRef = ref(db, `users/${user.uid}/details`);
            onValue(detailsRef, (snapshot) => {
                if(snapshot.val() === null) {
                    console.log('nothing here');
                } else {
                    const data = snapshot.val();
                    setDetails(data);
                }
            });
        } catch(error) {
            console.log(error);
        }
    },[])

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.list}>
                <List.Section experimental_accessibilityOrder={["C", "B", "A"]}>
                    <List.Subheader>Personal details</List.Subheader>
                    <List.Item 
                        accessible={true}
                        nativeID="A"
                        title='Name'
                        description={details.name}
                    />
                    <List.Item
                        nativeID="B"
                        aria-hidden={true}
                        title='do not perceive'
                        description={details.email}
                        onPress={() => showDialog('email', (details.email), 'change email')}
                    />
                    <List.Item
                        nativeID="C"
                        focusable={false}
                        title='shit'
                        description={user.password}
                        onPress={() => showDialog('password', '', 'change password')}
                    />
                </List.Section>
                <List.Section>
                    <List.Subheader>Settings</List.Subheader>
                    <List.Item
                        title='Max'
                        description={details.max}
                        onPress={() => showDialog('max', (details.max).toString(), 'Determines the maximum number of lines in daily poems.')}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                    <List.Item
                        title='Min'
                        description={details.min}
                        onPress={() => showDialog('min', (details.min).toString(), 'Determines the minimum number of lines in daily poems.')}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                    <List.Item
                        title='PoemCount'
                        description={details.poemCount}
                        onPress={() => showDialog('poemCount', (details.poemCount).toString(), 'Determines the number of daily poems.')}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                </List.Section>
            </View>
            <View style={[styles.overlay, visible ? {backgroundColor: 'rgba(0, 0, 0, 0.5)'} : '']}>
                <View style={styles.modalFlex}>
                    <Modal 
                        visible={visible}
                        onDismiss={hideDialog}
                        transparent={true} 
                        animationType="fade"
                        statusBarTranslucent={true}
                    >
                        <View style={styles.modal}>
                            <View style={styles.modalContent}>
                                <Text>{editable.name}</Text>
                                {editable.name == 'email' || 'password' ?
                                <View>
                                    <TextInput 
                                        placeholder={editable.value}
                                        onChangeText={(text) => setEdit(text)}
                                        error={error} 
                                        keyboardType="email-address"
                                        textContentType="emailAddress" 
                                        autoCorrect={false} 
                                        autoCapitalize="none"
                                    />
                                    <Text>{editable.explanation}</Text>
                                </View>
                                :
                                <View>
                                    <TextInput 
                                        placeholder={editable.value}
                                        onChangeText={(text) => setEdit(text)} 
                                        error={error} 
                                        keyboardType='numeric'
                                    />
                                    <Text>{editable.explanation}</Text>
                                    <Text type="error" visible={hasNumericErrors()}>{editable.name} should be a valid integer.</Text>
                                </View>
                                }
                            </View>
                            <View style={styles.buttons}>
                                {editable.name == 'email' ?
                                <Button onPress={() =>  {changeEmail(), hideDialog()}}>Edit</Button>
                                : editable.name == 'password' ? 
                                    <Button onPress={() => {changePassword(), hideDialog()}}>Edit</Button> 
                                : <Button onPress={() => {editDetails(), hideDialog()}} disabled={hasNumericErrors()}>Edit</Button>}
                                <Button onPress={() => hideDialog()}>exit</Button>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b699e3ff',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#3744f7ff'
    },
    list: {
        flex: 1,
        backgroundColor: '#fff',
        width: '85%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
        marginBottom: 20
    },
    buttons: {
        flexDirection: 'row',
        width: 200,
        alignItems: 'flex-end'
    },
    modalContent: {
        padding: 10,
        
    },
    modal: {
        justifyContent: 'center',
        backgroundColor: '#f08dd7ff',
        borderColor: '#cd4ee6ff',
        borderWidth: 5,
        top: '40%',
        padding: 20,
        borderRadius: 20,
        borderWidth: 3,
        
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalFlex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});