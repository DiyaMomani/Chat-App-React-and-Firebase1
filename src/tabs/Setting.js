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
  import {useIsFocused, useNavigation} from '@react-navigation/native';
  let id='';
const Setting =()=>{
    const[users,setUsers]=useState([]);
    const navigation= useNavigation();
    useEffect(()=>{
        getUsers();
    },[]);
    const getUsers=async()=>{
      id=await AsyncStorage.getItem('USERID');
        let tempData=[]
        const email=await AsyncStorage.getItem('EMAIL');
        firestore()
            .collection('users')
            .where('email','!=',email)
            .get()
            .then(res=>{
                console.log(tempData);
                if(res.docs.length>0){
                    res.docs.map(item=>{
                        tempData.push(item.data());
                        console.log(item.data());
                    });
                }
                setUsers(tempData);
                
            });
    };
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
export default Setting;
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
