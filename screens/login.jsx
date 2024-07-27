import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, KeyboardAvoidingView, Keyboard, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { scale } from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../assets/utils/axiosConfig';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        if (token) {
          navigation.replace('BottomTabs')
        }
      } catch (err) {
        console.log(`Error login using token: ${err}`)
      }
    }
    checkLoginStatus();
  }, [])

  const onPressSignUp = () => {
    navigation.navigate('register');
  }

  const onPressLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password");
      return;
    }
    const user = {
      email: email.trim(),
      password: password.trim()
    };
    try {
      const response = await axiosInstance.post('/login', user);
      const token = response.data.token;
      const userInfo = email;
      await AsyncStorage.setItem('userEmail', userInfo);
      await AsyncStorage.setItem('authToken', token);
      navigation.replace('BottomTabs');
    } catch (err) {
      Alert.alert("Login Failed", "Invalid email or password");
      console.log(err.request || err.message || err);
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Image
            style={styles.imageLogo}
            source={require('../assets/logo.webp')}
          />
          <Text style={styles.headerText}>Login To Your Account</Text>
        </View>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <View style={styles.input}>
            <FontAwesome5 name='envelope' size={scale(20)} color={'#041E42'} style={{ marginLeft: scale(8) }} />
            <TextInput
              placeholder='Enter Your Email'
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.input}>
            <FontAwesome5 name='lock' size={scale(20)} color={'#041E42'} style={{ marginLeft: scale(8) }} />
            <TextInput
              placeholder='Enter Your Password'
              style={styles.textInput2}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.toggleButton}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={scale(20)} color={'#041E42'} />
            </TouchableOpacity>
          </View>
          <View style={styles.optionsRow}>
            <Text style={styles.text1}>Keep me logged in</Text>
            <Text style={styles.text2}>Forgot Password</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginView}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onPressLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signupRow}>
            <Text style={styles.text3}>Don't have an account?</Text>
            <TouchableOpacity onPress={onPressSignUp}>
              <Text style={styles.text4}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageLogo: {
    height: scale(100),
    width: scale(150),
    marginTop: scale(20),
    alignSelf: 'center'
  },
  headerText: {
    fontSize: scale(17),
    color: '#041E42',
    marginTop: scale(12),
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  form: {
    marginTop: scale(50),
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
    marginTop: scale(10),
    borderRadius: scale(5),
    padding: scale(5),
    width: scale(300),
    alignSelf: 'center'
  },
  textInput: {
    width: scale(250),
    fontSize: scale(17),
    color: '#041E42'
  },
  textInput2: {
    width: scale(200),
    fontSize: scale(17),
    color: '#041E42'
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: scale(10),
    justifyContent: 'space-between',
    paddingHorizontal: scale(20)
  },
  text1: {
    color: '#041E42',
    fontSize: scale(12)
  },
  text2: {
    color: 'blue',
    fontSize: scale(12),
  },
  loginButton: {
    backgroundColor: '#FEBE10',
    marginTop: scale(70),
    height: scale(50),
    width: scale(200),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: scale(10)
  },
  loginText: {
    color: '#041E42',
    fontSize: scale(19),
    textAlign: 'center'
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(20)
  },
  text3: {
    color: '#041E42',
    fontSize: scale(14)
  },
  text4: {
    color: 'blue',
    fontSize: scale(14),
    marginLeft: scale(5)
  },
  toggleButton: {
    padding: scale(10),
    marginLeft: scale(0)
  }
});
