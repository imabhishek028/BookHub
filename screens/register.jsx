import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, KeyboardAvoidingView, Keyboard, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { scale } from 'react-native-size-matters'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import axios from 'axios'

const Register = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const onPressSignIn = () => {
    navigation.navigate('login')
  }

  const onPressRegister = () => {
    const user = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim()
    }
  
    axios.post('http://localhost:8000/register', user)
      .then((response) => {
        console.log(response)
        Alert.alert("Registered Successfully!", 'You have registered successfully, Reading Rampage on!')
        setEmail("")
        setName("")
        setPassword("")
        navigation.replace('BottomTabs');
      }).catch((error) => {
        console.log(`Error in the end ${error}`)
        Alert.alert("Registration failed!","Registration has failed, kindly try again")
      })
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Image
          style={styles.imageLogo}
          source={require('../assets/logo.webp')}
        />
        <Text style={{ fontSize: scale(17), color: '#041E42', marginTop: scale(12), fontWeight: 'bold', alignSelf: 'center' }}>
          Register To Your Account
        </Text>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView>
        <View style={{ marginTop: scale(50) }}>
          <View style={styles.input}>
            <FontAwesome5 name='user' size={scale(20)} color={'#041E42'} style={{ marginLeft: scale(8) }} />
            <TextInput
              placeholder='Enter Your Name'
              style={styles.textInput}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.input}>
            <FontAwesome5 name='envelope' size={scale(20)} color='#041E42' style={{ marginLeft: scale(8) }} />
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
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text1}>
              Keep me logged in
            </Text>
            <Text style={styles.text2}>
              Forgot Password
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginView}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onPressRegister}>
              <Text style={styles.loginText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'center', flexDirection: 'row', gap: scale(5) }}>
            <Text style={styles.text3}>
              Already have an account?
            </Text>
            <TouchableOpacity>
              <Text style={styles.text4}
                onPress={onPressSignIn}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Register

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
  input: {
    flexDirection: 'row',
    gap: scale(5),
    paddingVertical: scale(5),
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
  text1: {
    color: '#041E42',
    marginLeft: scale(25),
    marginTop: scale(12),
    fontSize: scale(12)
  },
  text2: {
    color: 'blue',
    marginTop: scale(12),
    fontSize: scale(12),
    marginLeft: scale(100),
  },
  loginButton: {
    alignItems: 'center',
  },
  loginView: {
    backgroundColor: '#FEBE10',
    marginTop: scale(80),
    height: scale(50),
    width: scale(200),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: scale(10)
  },
  loginText: {
    color: '#041E42',
    fontSize: scale(19),
  },
  text3: {
    color: '#041E42',
    marginTop: scale(12),
    fontSize: scale(14)
  },
  text4: {
    color: 'blue',
    marginTop: scale(12),
    fontSize: scale(14)
  },
})
