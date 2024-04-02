import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Meeting from '../../components/Meeting';

// import openDatabase hook 
import { openDatabase } from 'react-native-sqlite-storage'


// use hook to create database
const schedulerDB = openDatabase({name: 'Scheduler.db'});

// create constant that contains the name of the lists table 
const meetingTableName = 'meetings';
const hostMeetingsTableName = 'host_meetings';

const ViewHostMeetingsScreen = props => {

  const post = props.route.params.post;
  const navigation = useNavigation();

  const [meetings, setmeetings ] = useState([]);
  const [totalpeople, setTotalpeople] = useState(0);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare empty array that will store results of SELECT
      let results = [];
      // declare variable to compute the total price
      let total = 0;
      // declare transaction that will execute SELECT
      schedulerDB.transaction(txn => {
        
        // execute SELECT
        txn.executeSql(
          `SELECT meetings.id, title, location, date FROM ${meetingTableName}, ${hostMeetingsTableName} WHERE meetings.id = meeting_id AND host_id = ${post.id}`, 
          [],
          //callback function to handle results from SELECT
          (_, res) => {
            // get the number of rows selected
            let len = res.rows.length;
            // console.log('Number of rows: ' + len);
            // if more than one row of data was selected 
            if (len > 0){
              // loop through the rows of data
              for (let i = 0; i < len; i++){
                // push a row of data at a time onto results array 
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  title: item.title,
                  location: item.location,
                  date: item.date,
                });
                // compute total price 
                total = len;
              }
              // assign results array to lists state variables
              setmeetings(results);
              // assign computed total price to the total price state variable
              setTotalpeople(total);
            } else {
              // if no rows of data were selected 
              // assign empty array to lists state variables
              setmeetings([]);
              // assign a value of 0 to the total price state variables
              setTotalpeople(0);
            }
          },
          error => {
            console.log('Error getting host' + error.message);
          },
        )
      });
    });
      return listener;
  });

  const ListHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>For Host: {post.name}</Text>
      </View>
    );
  }

  const ListFooter = () => {
    return(
      <View style={styles.footer}>
        <Text style={styles.totalMeeting}>TOTAL MEETINGS: {totalpeople}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={meetings}
        renderItem={({item}) => <Meeting post={item}/>}
        keyExtractor={item => item.id}
        ListFooterComponent={ListFooter}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

export default ViewHostMeetingsScreen;