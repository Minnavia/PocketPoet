import { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase.config";
import { useAuth } from "../contexts/authContext";
import { Button, Dialog, Divider, List, Portal, TextInput, Text, PaperProvider, Switch, Chip, SegmentedButtons, HelperText } from "react-native-paper";
import { updateEmail, updatePassword, getIdToken, getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile () {

    const auth = getAuth();

    const {user, details} = useAuth();

    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState({
        name: '',
        value: '',
        explanation: ''
    });
    const random = details.random;
    const [isRandomOn, setIsRandomOn] = useState(random);
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
        setEditable({... editable, name: n, value: val, explanation: exp});
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };


    const hasNumericErrors = () => {
        return Number(edit) > 0 && Number.isInteger(Number(edit)) ? false : true;
    };


    const editDetails = () => {
        console.log(edit);
        set(ref(db, `users/${user.uid}/details/${editable.name}`), Number(edit));
    };

    const toggleRandom = (value) => {
        set(ref(db, `users/${user.uid}/details/random`), value);
        setIsRandomOn(value);
        console.log('did we do it', isRandomOn);
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text>Hello {details.name}!</Text>
            <Text>{editable.value}</Text>
            <Text>{edit}</Text>
            <Text>RandomOn: {JSON.stringify(isRandomOn)}</Text>
            <View style={styles.list}>
                <List.Section>
                    <List.Subheader>Personal details</List.Subheader>
                    <List.Item 
                        title='Name'
                        description={details.name}
                    />
                    <List.Item
                        title='Email'
                        description={details.email}
                        onPress={() => showDialog('email', (details.email), 'change email')}
                    />
                    <List.Item
                        title='Password'
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
                    <List.Item
                        title='Random'
                        description={details.random}
                        right={props => 
                        <View style={styles.buttons}>
                            <SegmentedButtons
                                value={isRandomOn}
                                onValueChange={(value) => toggleRandom(value)}
                                buttons={[
                                    {
                                        value: true,
                                        label: 'Enabled'
                                    },
                                    {
                                        value: false,
                                        label: 'Disabled'
                                    }
                                ]}
                            />
                        </View>}
                    />
                </List.Section>
            </View>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{editable.name}</Dialog.Title>
                        {editable.name == 'email' || 'password' ? 
                            <Dialog.Content>
                                <TextInput placeholder={editable.value} onChangeText={(text) => setEdit(text)} error={error} keyboardType="email-address" textContentType="emailAddress" autoCorrect={false} autoCapitalize="none"/> 
                            </Dialog.Content> 
                            : <Dialog.Content>
                                <TextInput placeholder={editable.value} onChangeText={(text) => setEdit(text)} error={error} keyboardType='numeric'/>
                                <HelperText type="error" visible={hasNumericErrors()}>wrong af</HelperText>
                            </Dialog.Content>}
                    <Dialog.Actions>
                        <Button onPress={() => hideDialog()}>exit</Button>
                        {editable.name == 'email' ?
                            <Button onPress={() =>  {changeEmail(), hideDialog()}}>Edit</Button>
                        : editable.name == 'password' ? 
                            <Button onPress={() => {changePassword(), hideDialog()}}>Edit</Button> 
                        : <Button onPress={() => {editDetails(), hideDialog()}} disabled={hasNumericErrors()}>Edit</Button>}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
        flex: 1,
        backgroundColor: 'pink',
        width: '90%'
    },
    buttons: {
        backgroundColor: 'grey',
        flexDirection: 'row',
        width: 200,
        alignItems: 'flex-end'
    }
});