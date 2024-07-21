import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../assets/utils/axiosConfig';

const CreateBook = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const selectPhoto = async () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setImageBase64(response.assets[0].base64);
        console.log(imageBase64)
      }
    });
  };

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setUserEmail(email);
      } catch (err) {
        console.log(err);
      }
    };
    getUserEmail();
  }, []);

  const submit = async () => {
    if (!title || !author || !genre || !imageBase64 || !description) {
      Alert.alert('Fill in all the details', 'Kindly fill all the details about the book');
    } else if (description.length < 10) {
      Alert.alert('Too short Description', 'The Description is too short, elaborate.');
    } else {
      try {
        const bookData = {
          user: userEmail,
          createdBook: {
            title,
            author,
            genre,
            description,
            coverImage: imageBase64,
          },
        };
  
        const response = await axiosInstance.post('/createBook', bookData);
        if (response.status === 200) {
          Alert.alert('Success', 'Book saved successfully');
        } else {
          Alert.alert('Error', 'Failed to save the book');
        }
        navigation.goBack()
      } catch (error) {
        console.error('Error saving book:', error);
        Alert.alert('Error', 'Failed to save the book');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.inner}>
          <TouchableOpacity  style={styles.imagePicker} onPress={selectPhoto}>
            {imageBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                style={styles.image}
              />
            ) : (
              <Image
                source={require('../assets/defaultPic.png')}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter Book Title'
              value={title}
              onChangeText={(value) => setTitle(value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Author:</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter Author Name'
              value={author}
              onChangeText={(value) => setAuthor(value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Genre:</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter Book Genre'
              value={genre}
              onChangeText={(value) => setGenre(value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder='Enter Book Description'
              multiline
              numberOfLines={8}
              value={description}
              onChangeText={(value) => setDescription(value)}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Save Book</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreateBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: scale(20),
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  image: {
    width: scale(140),
    height: scale(160),
    borderRadius: scale(8),
    borderWidth: 3,
    borderColor: '#000000',
  },
  inputContainer: {
    marginBottom: scale(20),
  },
  label: {
    fontSize: scale(16),
    marginBottom: scale(8),
    color: '#041E42',
    fontWeight: 'bold',
  },
  input: {
    height: scale(40),
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#F9F9F9',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    fontSize: scale(14),
    color: '#333333',
  },
  descriptionInput: {
    height: scale(120),
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});
