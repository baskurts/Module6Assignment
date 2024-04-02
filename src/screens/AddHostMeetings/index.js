import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Meeting from '../../components/Meeting';
// import openDatabase hook 
import { openDatabase } from 'react-native-sqlite-storage'

// create constatn object that refers to database 
const schedulerDB = openDatabase({name: 'Scheduler.db'});

// create constant that contains the name of the lists table 
const meetingTableName = 'meetings';

const AddHostMeetingScreen = props => {

    const post = props.route.params.post;

    const navigation = useNavigation();

  const [meetings, setmeetings ] = useState([]);
  const [totalpeople, setTotalpeople] = useState(0);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare empty array that will store results of SELECT
      let results = [];
      let total = 0;
      // declare transaction that will execute SELECT
      schedulerDB.transaction(txn => {
        
        // execute SELECT
        txn.executeSql(
          `SELECT * FROM ${meetingTableName}`, 
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
                  host_id: post.id,
                });
                total = len
              }
              // assign results array to lists state variables
              setmeetings(results);
              setTotalpeople(total);
            } else {
              // if no rows of data were selected 
              // assign empty array to lists state variables
              setmeetings([]);
              setTotalpeople(0);
            }
          },
          error => {
            console.log('Error getting lists' + error.message);
          },
        )
      });
    });
      return listener;
  });

  const ListHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>To Host: {post.name}</Text>
      </View>
    );
  }
  const ListFooter = () => {
    return(
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>TOTAL MEETINGS: {totalpeople}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <FlatList
            data={meetings}
            renderItem={({item}) => <Meeting post={item} />}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
        />
    </View>
  );
};

export default AddHostMeetingScreen;