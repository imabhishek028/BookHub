import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import axiosInstance from '../assets/utils/axiosConfig';


const UserProfile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [editingField, setEditingField] = useState('');
    const [phone, setPhone] = useState('');


    const selectPhoto = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64:true
          }).then(image => {
            console.log(image);
          });
    }

    useEffect(() => {
        const gettingUserInfo = async () => {
            try {
                const userEmail = await AsyncStorage.getItem('userEmail');
                if (userEmail) {
                    setEmail(userEmail);
                    const response = await axios.get('http://192.168.242.122:8000/userProfile', {
                        params: { email: userEmail }
                    });
                    const userInfo = response.data;
                    setName(userInfo.name || '');
                    setAge(userInfo.age || '');
                    setGender(userInfo.gender || '');
                    setPhone(userInfo.phone || '');
                }
            } catch (err) {
                console.log('Error fetching user info:', err.response);
            }
        };

        gettingUserInfo();
    }, []);

    const onSave = async () => {
        setEditingField('');
        try {
            const res = await axios.post('http://192.168.52.122:8000/updateUserProfile', {
                email: email,
                name: name,
                age: age,
                gender: gender,
                phone: phone,
            });
            Alert.alert("Updated!","Profile has now been updated")
        } catch (err) {
            console.log('Error saving user info:', err);
        }
    };

    const renderEditField = (field) => (
        <View style={styles.editContainer}>
            <TextInput
                style={styles.input}
                placeholder={`Enter ${field}`}
                placeholderTextColor='gray'
                value={field === 'name' ? name : field === 'age' ? age : field === 'phone' ? phone : gender}
                onChangeText={(value) => {
                    if (field === 'name') setName(value);
                    else if (field === 'age') setAge(value);
                    else if (field === 'phone') setPhone(value);
                    else setGender(value);
                }}
                keyboardType={field === 'age' || field === 'phone' ? 'numeric' : 'default'}
            />
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity
                onPress={()=>selectPhoto()}>
                    <Image
                        source={require('../assets/defaultPic.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
                <Text style={styles.emailText}>
                    {email}
                </Text>
            </View>
            <View style={styles.infoBox}>
                <View style={styles.paraContainer}>
                    <Text style={styles.typeText}>
                        Name:
                    </Text>
                    {editingField === 'name' ? (
                        renderEditField('name')
                    ) : (
                        <>
                            <Text style={styles.valueText}>
                                {name}
                            </Text>
                            <TouchableOpacity onPress={() => setEditingField('name')}>
                                <FontAwesome5 name='pen' size={scale(18)} color={'black'} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={styles.paraContainer}>
                    <Text style={styles.typeText}>
                        Age:
                    </Text>
                    {editingField === 'age' ? (
                        renderEditField('age')
                    ) : (
                        <>
                            <Text style={styles.valueText}>
                                {age}
                            </Text>
                            <TouchableOpacity onPress={() => setEditingField('age')}>
                                <FontAwesome5 name='pen' size={scale(18)} color={'black'} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={styles.paraContainer}>
                    <Text style={styles.typeText}>
                        Phone:
                    </Text>
                    {editingField === 'phone' ? (
                        renderEditField('phone')
                    ) : (
                        <>
                            <Text style={styles.valueText}>
                                {phone}
                            </Text>
                            <TouchableOpacity onPress={() => setEditingField('phone')}>
                                <FontAwesome5 name='pen' size={scale(18)} color={'black'} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={styles.paraContainer}>
                    <Text style={styles.typeText}>
                        Gender:
                    </Text>
                    {editingField === 'gender' ? (
                        renderEditField('gender')
                    ) : (
                        <>
                            <Text style={styles.valueText}>
                                {gender}
                            </Text>
                            <TouchableOpacity onPress={() => setEditingField('gender')}>
                                <FontAwesome5 name='pen' size={scale(18)} color={'black'} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: scale(20),
    },
    image: {
        width: scale(150),
        height: scale(150),
        borderRadius: scale(75),
        borderWidth: 4,
        borderColor: '#041E42',
    },
    infoBox: {
        width: '100%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    emailText: {
        color: '#041E42',
        fontSize: scale(14),
        fontWeight: 'bold',
        marginTop: scale(10),
    },
    paraContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(10),
    },
    typeText: {
        color: 'gray',
        flex: 1,
        fontSize: scale(14),
    },
    valueText: {
        color: '#041E42',
        fontSize: scale(16),
        fontWeight: 'bold',
        flex: 2,
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontSize: scale(16),
        padding: scale(10),
        flex: 2,
        color: 'black',
    },
    saveButton: {
        backgroundColor: '#FEBE10',
        height: scale(40),
        width: scale(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(10),
        marginLeft: scale(10),
    },
    saveText: {
        color: '#041E42',
        fontSize: scale(16),
    },
});
