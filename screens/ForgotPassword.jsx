import { Alert, Keyboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import axiosInstance from '../assets/utils/axiosConfig';



const ForgotPassword = ({navigation, route}) => {
    const [passKey, setpassKey] = useState();
    const [password, setPassword] = useState();


    const handleSubmit = async () => {
        try {
            const res = await axiosInstance.post('/updatePassword', {
                email: email,
            });

            if (res.status === 200) {
                Alert.alert('Email sent!','Email containing passkey is sent');
                navigation.goBack();
            } else {
                Alert.alert('Invalid Passkey', 'Kindly try again');
            }
        } catch (error) {
            console.error('Error reseting password:', error);
            Alert.alert('Error', 'An error occurred while reseting the password. Please try again later.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Reset Password</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Passkey</Text>
                    <TextInput
                        placeholder='Enter Passkey From Email'
                        style={styles.textInput}
                        value={passKey}
                        onChangeText={setpassKey}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        placeholder='Confirm Your New Password'
                        style={styles.textInput}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword

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
})