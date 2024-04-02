import React, {useState} from 'react';
import styles from './styles';
import { View, Text, TextInput, Pressable, Alert} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerAndroid  from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

// import openDatabase hook 
import { openDatabase } from 'react-native-sqlite-storage'

// use hook to create database
const schedulerDB = openDatabase({name: 'Scheduler.db'});

// create constants for tables in database
const hostTableName = 'hosts';

const ExistingHostScreen = props => {

    const post = props.route.params.post;

    const [name, setName] = useState(post.name);
    const [email, setEmail] = useState(post.email);


    const navigation = useNavigation();


    const onListUpdate = () => {
        if (!name){
            alert('Please enter your full name.');
            return;
        }
        if (!email){
          alert('Please enter your email address.');
          return;
        }
        
        schedulerDB.transaction(txn => {
            txn.executeSql(
                `UPDATE ${hostTableName} SET name = "${name}", email = "${email}" WHERE id = "${post.id}"`,
                [],
                () => {
                    console.log(`${name} update successfully`);
                },
                error => {
                    console.log('Error on updating host ' + error.message);
                }
            );
        });

        alert(name + ' updated!');
    }

    const onListDelete = () => {
        return Alert.alert(
            // title
            'Confirm',
            // message
            'Are you sure you want to delete this list?',
            // code for buttons
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        schedulerDB.transaction(txn => {
                            txn.executeSql(
                                `DELETE FROM ${hostTableName} WHERE id= ${post.id}`,
                                [],
                                () => {
                                    console.log(`${name} deleted successfully`);
                                },
                                error => {
                                    console.log('Error on deleting host '+ error.message);
                                }
                            );
                        });
                        alert('Host Deleted!');
                    },
                },
                {
                    text: 'No',
                },
            ],
        );
    }

    const onAddMeeting = () => {
        navigation.navigate('Assign Meeting', {post:post});
    }
    const onViewMeeting = () => {
        navigation.navigate('View Meetings', {post:post});
    }

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
        <TextInput
            value={name}
            onChangeText={value => setName(value)}
            style={styles.name}
            placeholder={'Enter Name'}
            placeholderTextColor={'grey'}
        />
        <TextInput
            value={email}
            onChangeText={value => setEmail(value)}
            style={styles.email}
            placeholder={'Enter Email'}
            placeholderTextColor={'grey'}
        />
      </View>
      <View style={styles.bottomContainer}>
          <Pressable style={styles.updateButton} onPress={onListUpdate}>
              <Text style={styles.buttonText}>Update</Text>
          </Pressable>
      </View>
      <View style={styles.bottomContainer}>
          <Pressable style={styles.deleteButton} onPress={onListDelete}>
              <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
      </View>
      <View style={styles.bottomContainer}>
          <Pressable style={styles.addButton} onPress={onAddMeeting}>
              <Text style={styles.buttonText}>Assign Meetings</Text>
          </Pressable>
      </View>
      <View style={styles.bottomContainer}>
          <Pressable style={styles.viewButton} onPress={onViewMeeting}>
              <Text style={styles.buttonText}>View Meetings</Text>
          </Pressable>
      </View>
    </View>
  );
};

export default ExistingHostScreen;