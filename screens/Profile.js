import { useEffect, useState } from "react"
import { View } from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase.config";
import { useAuth } from "../contexts/authContext";
import { Button, Dialog, Divider, List, Portal, TextInput, Text, PaperProvider } from "react-native-paper";

export default function Profile () {

    const {user} = useAuth();

    const [details, setDetails] = useState({});
    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState({
        name: '',
        value: '',
        explanation: ''
    });
    const [edit, setEdit] = useState('');

    useEffect(() => {
        try {
            const detailsRef = ref(db, `users/${user.uid}/details`);
            onValue(detailsRef, (snapshot) => {
                const data = snapshot.val();
                setDetails(data);
            });
            console.log('details', details);
        } catch(error) {
            console.log(error);
        }
    }, []);

    const showDialog = (n, val, exp) => {
        setEditable({... editable, name: n, value: val, explanation: exp});
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const editDetails = () => {
        console.log(edit);
        set(ref(db, `users/${user.uid}/details/${editable.name}`), Number(edit));
    };

    return(
        <PaperProvider>
        <View>
            <Text>Hello {details.name}!</Text>
            <Text>{editable.value}</Text>
            <Text>{edit}</Text>
            <List.Section>
                <List.Subheader>Personal details</List.Subheader>
                <List.Item 
                    title='Name'
                    description={details.name}
                />
                <List.Item
                    title='Email'
                    description={details.email}
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
            </List.Section>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{editable.name}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{editable.explanation}</Text>
                        <TextInput placeholder={editable.value} onChangeText={(text) => setEdit(text)}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => hideDialog()}>exit</Button>
                        <Button onPress={() => {editDetails(), hideDialog()}}>Edit</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
        </PaperProvider>
    )
}