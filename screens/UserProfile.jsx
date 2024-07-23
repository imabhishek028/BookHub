import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axiosInstance from '../assets/utils/axiosConfig';
import { launchImageLibrary } from 'react-native-image-picker';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [editingField, setEditingField] = useState('');
    const [phone, setPhone] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [photo, setPhoto] = useState(require('../assets/defaultPic.png'));
    const [loading, setLoading] = useState(false);

    const selectPhoto = async () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorCode);
            } else if (response.assets && response.assets.length > 0) {
                setImageBase64(response.assets[0].base64);
            }
        });
    };

    useEffect(() => {
        const gettingUserInfo = async () => {
            try {
                const userEmail = await AsyncStorage.getItem('userEmail');
                if (userEmail) {
                    setEmail(userEmail);
                    const response = await axiosInstance.get('/userProfile', {
                        params: { email: userEmail }
                    });
                    const userInfo = response.data;
                    setName(userInfo.name || '');
                    setAge(userInfo.age || '');
                    setGender(userInfo.gender || '');
                    setPhone(userInfo.phone || '');
                    if (userInfo.profilePicture) {
                        setPhoto({ uri: userInfo.profilePicture });
                    }
                }
            } catch (err) {
                console.log('Error fetching user info:', err.response);
            }
        };

        gettingUserInfo();
    }, []);

    const onSave = async () => {
        Keyboard.dismiss();
        setEditingField('');
        setLoading(true);
        try {
            const res = await axiosInstance.post('/updateUserProfile', {
                email: email,
                name: name,
                age: age,
                gender: gender,
                phone: phone,
                profilePicture: imageBase64
            });
            Alert.alert("Updated!", "Profile has now been updated", [
                { text: "OK", onPress: () => setLoading(false) }
            ]);
        } catch (err) {
            console.log('Error saving user info:', JSON.stringify(err));
            setLoading(false);
        }
    };

    const renderEditField = (field) => (
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
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageBase64 ? { uri: `data:image/jpeg;base64,${imageBase64}` } : photo}
                    style={styles.image}
                />
                <TouchableOpacity style={styles.editPhotoButton} onPress={selectPhoto}>
                    <FontAwesome5 name='pen' size={scale(18)} color={'#041E42'} />
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
            <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={onSave}
                disabled={loading}
            >
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

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
    editPhotoButton: {
        backgroundColor: '#FEBE10',
        padding: scale(10),
        borderRadius: scale(5),
        marginTop: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailText: {
        color: '#041E42',
        fontSize: scale(14),
        fontWeight: 'bold',
        marginTop: scale(10),
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
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(10),
        marginTop: scale(20),
    },
    saveButtonDisabled: {
        backgroundColor: '#ddd',
    },
    saveText: {
        color: '#041E42',
        fontSize: scale(16),
    },
});

export default UserProfile;
