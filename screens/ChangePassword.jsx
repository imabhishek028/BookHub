import { Alert, Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../assets/utils/axiosConfig';

const ChangePassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confNewPassword, setConfNewPassword] = useState('');

  useEffect(()=>{
    const getEmail=async ()=>{
        try {
            const email = await AsyncStorage.getItem('userEmail');
            if (email) setEmail(email);
        } catch (err) {
            console.log(err);
        }
    }
  },[])

  const handleSubmit = async () => {
   if(newPassword!=confNewPassword){
    Alert.alert('Error','Confirmation password is different')
    setConfNewPassword('')
    setNewPassword('')
   }else{
    const res= await axiosInstance.post('/updatePassword',{
        email:email,
        oldPassword:oldPassword,
        newPassword:newPassword
    })
    if(res.status==401){
        Alert.alert('Incorrect Old Password', 'Kindly check your previous password')
    }else {
        Alert.alert('Password changed successfully!')
        navigation.goBack();
    }
   }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Change Password</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Old Password</Text>
            <TextInput
              placeholder='Enter Your Old Password'
              style={styles.textInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder='Enter Your New Password'
              style={styles.textInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              placeholder='Confirm Your New Password'
              style={styles.textInput}
              value={confNewPassword}
              onChangeText={setConfNewPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: scale(20),
    backgroundColor: '#F8F9FA',
  },
  inner: {
    padding: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(10),
    elevation: 5,
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(20),
    textAlign: 'center',
    color: '#041E42',
  },
  inputContainer: {
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(16),
    marginBottom: scale(5),
    color: '#041E42',
  },
  textInput: {
    height: scale(40),
    borderColor: '#041E42',
    borderWidth: 1,
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: '#F1F1F1',
    fontSize: scale(16),
    color: '#333333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: scale(20),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});
