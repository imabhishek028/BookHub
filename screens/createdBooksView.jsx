import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axiosInstance from '../assets/utils/axiosConfig';

const CreatedBooksView = ({ navigation, route }) => {
  const { item, email } = route.params;

  const onPressDelete = async () => {
    try {
      const response = await axiosInstance.delete('/deleteCreatedBook', {
        data: {
          email: email,
          item: item,
        },
      });
      if (response.status === 200) {
        navigation.goBack();
      }
    } catch (err) {
        Alert.alert('Error deleting book', 'Kindly try again, an unexpected error occured')
      console.log(`Error deleting item: ${err}`);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.coverImageView}>
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
          <TouchableOpacity style={styles.deleteIconContainer} onPress={onPressDelete}>
            <FontAwesome5 name="trash-alt" size={scale(25)} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.row}>
            <Text style={styles.whatText}>by</Text>
            <Text style={styles.author}>{item.author}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.whatText}>Genre:</Text>
            <Text style={styles.genre}>{item.genre || 'N/A'}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default CreatedBooksView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: scale(20),
  },
  coverImageView: {
    marginBottom: scale(20),
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  coverImage: {
    height: scale(200),
    width: scale(150),
    borderRadius: scale(10),
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#000000',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(15),
    padding: scale(5),
    elevation: 3,
  },
  detailsContainer: {
    paddingHorizontal: scale(20),
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#041E42',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  author: {
    fontSize: scale(18),
    color: '#041E42',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  genre: {
    fontSize: scale(18),
    color: '#041E42',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  description: {
    fontSize: scale(18),
    color: '#041E42',
    textAlign: 'left',
  },
  whatText: {
    color: '#888888',
    fontSize: scale(16),
  },
  row: {
    flexDirection: 'row',
    marginBottom: scale(5),
    gap:scale(5)
  },
  descriptionContainer: {
    padding: scale(10),
    backgroundColor: '#f8f8f8',
    borderRadius: scale(10),
    width: '100%',
    elevation: 2,
  },
});
