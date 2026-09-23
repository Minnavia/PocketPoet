import { useEffect, useState } from "react"
import { Alert, Modal, StyleSheet, View, Text, ActivityIndicator, ScrollView } from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase.config";
import { useAuth } from "../contexts/authContext";
import { Button, Divider, HelperText, List, TextInput } from "react-native-paper";
import { updateEmail, updatePassword, getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile () {

    const auth = getAuth();

    const {user} = useAuth();

    const [details, setDetails] = useState({});

    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState({
        name: '',
        accessibleName: '',
        value: '',
        explanation: ''
    });
    const [edit, setEdit] = useState('');
    const [numericError, setNumericError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [authMsg, setAuthMsg] = useState('');

    const changeEmail = () => {
        if (edit == '') {
            setAuthError(true);
            setAuthMsg("Please provide a valid email address in the format name@domain.com");
        }
        else {
            updateEmail(auth.currentUser, edit)
            .then(() => {
                set(ref(db, `users/${user.uid}/details/${editable.name}`), edit);
                console.log('email updated!');
                hideDialog();
            })
            .catch((error) => {
                if (error.code == 'auth/invalid-email') {
                    setAuthError(true);
                    setAuthMsg("Please provide a valid email address in the format name@domain.com");
                    console.log('invalid');
                }
                console.log(error);
            });
        }
    };

    const changePassword = () => {
        if (edit == '') {
            setAuthError(true);
            setAuthMsg("Please provide a password.");
        } else {
            updatePassword(auth.currentUser, edit)
            .then(() => {
                console.log('password changed!');
                hideDialog();
            })
            .catch((error) => {
                if (error.code == "auth/missing-password") {
                    setAuthError(true);
                    setAuthMsg("Please enter a password.");
                }
                if (error.code == "auth/weak-password") {
                    setAuthError(true);
                    setAuthMsg("Password should be at least 6 characters.");
                }
                console.log(error);
            });
        }
    };

    const hasNumericErrors = () => {
        if (Number(edit) > 0) {
            console.log(edit, " is larger than 0")
            if (Number.isInteger(Number(edit)) == true) {
                console.log(edit, " is an integer")
                return false;
            }
        }
        else {
            setNumericError(true);
            return true;
        }
    };

    const showDialog = (n, m, val, exp) => {
        console.log('details showdialog', details);
        console.log('error?', {numericError});
        setEditable({name: n,accessibleName: m, value: val, explanation: exp});
        setVisible(true);
    };

    const hideDialog = () => {
        setEdit('');
        setVisible(false);
        setNumericError(false);
        setAuthError(false);
    };

    const editDetails = () => {
        if (hasNumericErrors() == false) {
            set(ref(db, `users/${user.uid}/details/${editable.name}`), Number(edit));
            console.log("details", details);   
            hideDialog();
        }
    };

    const [loading, setLoading] = useState(true);

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
            const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
        } catch(error) {
            console.log(error);
        }
    },[])

    return(
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size='large' color='#0000ff'/>
            ) : (
            <>
                <ScrollView style={styles.list}>
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
                        title='Email'
                        description={details.email}
                        onPress={() => showDialog('email', 'Email', (details.email), 'change your email')}
                    />
                    <List.Item
                        nativeID="C"
                        title='Password'
                        accessibilityHint="Change your password"
                        description={user.password}
                        onPress={() => showDialog('password', 'Password', '', 'change your password')}
                    />
                </List.Section>
                <List.Section>
                    <List.Subheader>Daily poem settings</List.Subheader>
                    <List.Item
                        title='Maximum number of lines'
                        titleNumberOfLines={0}
                        description={details.max}
                        accessibilityLabel="Maximum number of lines."
                        accessibilityValue={{text: details.max.toString()}}
                        accessibilityHint="Change how long your daily poems can be."
                        onPress={() => showDialog('max', 'Maximum number of lines', (details.max).toString(), "Change how long your daily poems can be.")}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                    <List.Item
                        title='Minimum number of lines'
                        titleNumberOfLines={0}
                        description={details.min}
                        accessibilityLabel="Minimum number of lines."
                        accessibilityValue={{text: details.min.toString()}}
                        accessibilityHint="Change how short your daily poems can be."
                        onPress={() => showDialog('min', 'Minimum number of lines', (details.min).toString(), "Change how short your daily poems can be.")}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                    <List.Item
                        title='Number of daily poems'
                        titleNumberOfLines={0}
                        description={details.poemCount}
                        accessibilityLabel="Number of daily poems."
                        accessibilityValue={{text: details.poemCount.toString()}}
                        accessibilityHint="Change how many daily poems you get."
                        onPress={() => showDialog('poemCount', 'Number of daily poems', (details.poemCount).toString(), "Change how many daily poems you get.")}
                        right={props => <List.Icon {...props} icon='pencil' />}
                    />
                    <Divider/>
                </List.Section>
                </ScrollView>
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
                                    <Text accessibilityRole="header" nativeID="editableName">{editable.accessibleName}</Text>
                                    {editable.name == 'email' || editable.name == 'password' ?
                                    <View>
                                        <View aria-hidden={true}>
                                            <Text>{editable.explanation}</Text>
                                        </View>
                                        <TextInput 
                                            onChangeText={(text) => setEdit(text)}
                                            error={authError} 
                                            keyboardType="email-address"
                                            textContentType="emailAddress" 
                                            autoCorrect={false} 
                                            autoCapitalize="none"
                                            placeholder={editable.value}
                                        />
                                        <HelperText type="error" accessibilityLiveRegion="polite" visible={authError}>{authMsg}</HelperText>
                                    </View>
                                    :
                                    <View>
                                        <View aria-hidden={true}>
                                            <Text>{editable.explanation}</Text>
                                        </View>
                                            <TextInput 
                                                onChangeText={(text) => {
                                                    setEdit(text);
                                                }}
                                                error={numericError} 
                                                keyboardType='numeric'
                                                placeholder={editable.value}
                                        />
                                        <HelperText type="error" accessibilityLiveRegion="polite" visible={numericError}>{editable.accessibleName} should be greater than zero.</HelperText>
                                    </View>
                                    }
                                </View>
                                <View style={styles.buttons}>
                                    {editable.name == 'email' ?
                                    <Button onPress={() =>  changeEmail()}>Edit</Button>
                                    : editable.name == 'password' ? 
                                        <Button onPress={() => changePassword()}>Edit</Button> 
                                    : <Button onPress={() => editDetails()}>Edit</Button>}
                                    <Button onPress={() => hideDialog()}>exit</Button>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </>
            )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    list: {
        flex: 1,
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D0BFFF',
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
        backgroundColor: '#fff',
        borderColor: '#b699e3ff',
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