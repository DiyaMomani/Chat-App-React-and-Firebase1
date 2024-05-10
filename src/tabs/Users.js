import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import firestore from '@react-native-firebase/firestore';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {CommonActions, useIsFocused, useNavigation} from '@react-navigation/native';
  let id='';
const Users =()=>{
    const[users,setUsers]=useState([]);
    const[found,setFound]=useState(false);
    const navigation= useNavigation();
    useEffect(()=>{
        getUsers();
    },[]);

  
    const getUsers = async () => {
      try {
          const id = await AsyncStorage.getItem('USERID');
          const email = await AsyncStorage.getItem('EMAIL');
          const tempData = [];
          console.log(email);
          const usersSnapshot = await firestore()
              .collection('users')
              .where('email', '!=', email)
              .get();

          await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
              const toId = userDoc.data().userId;
              const messagesSnapshot = await firestore()
                  .collection('chats')
                  .doc(id + toId)
                  .collection('messages')
                  .get();

              if (messagesSnapshot.docs.length > 0) {
                  tempData.push(userDoc.data());
              }
          }));

          setUsers(tempData);
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  };  
  // console.log('wowowowowo  ',users);
  console.log("I am here ");
  //console.log('Items -> ' , item , );
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Diya Chat App</Text>
            </View>
            <FlatList 
                data={users} 
                renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={styles.userItem} onPress={()=>{
                          navigation.navigate('Chat',{data:item , id:id});
                        }}>
                            <Image 
                                source={require('../images/user.png')} 
                                style={styles.userIcon}
                            />
                            <Text style={styles.name}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                 }}
            />
        </View>
    );
};
export default Users;
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
    },
    header: {
      width: '100%',
      height: 60,
      backgroundColor: 'white',
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'purple',
      fontSize: 20,
      fontWeight: '600',
    },
    userItem: {
      width: Dimensions.get('window').width - 50,
      alignSelf: 'center',
      marginTop: 20,
      flexDirection: 'row',
      height: 60,
      borderWidth: 0.5,
      borderRadius: 10,
      paddingLeft: 20,
      alignItems: 'center',
    },
    userIcon: {
      width: 40,
      height: 40,
    },
    name: {
      color: 'black', 
      marginLeft: 20, 
      fontSize: 20,
    },
  });