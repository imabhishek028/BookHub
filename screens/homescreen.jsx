import { SafeAreaView, StyleSheet, Text, View, StatusBar, TextInput, Keyboard, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import { scale } from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const Homescreen = () => {

  const [search, setSearch] = useState('The Lord of the Rings');
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPressSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?title=${search}&limit=5`);
      const books = response.data.docs.map(book => ({
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        firstPublishYear: book.first_publish_year,
        coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null
      }));
      setBookData(books);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => {
    const defaultImage = 'https://via.placeholder.com/100x160.png?text=No+Image';
    return (
      <TouchableOpacity style={styles.renderItem}>
        <View style={{ flexDirection: 'row', gap: scale(20) }}>
          <Image
            source={{ uri: item.coverImage || defaultImage }}
            style={styles.coverImages}
            resizeMode='contain'
          />
          <View style={{ flex: 1 }}>
            <View style={styles.bookTitleView}>
              <Text style={styles.bookTitle}>{item.title}</Text>
            </View>
            <View style={styles.authorView}>
              <Text style={{ color: 'gray', fontSize: scale(14) }}>by</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <View style={styles.publishYearView}>
              <Text style={styles.publishYearText}>First Published:</Text>
              <Text style={styles.yearText}> {item.firstPublishYear || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.inputView}>
        <TextInput
          placeholder='Search Book...'
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={onPressSearch} disabled={loading}>
          <FontAwesome5 name='search' size={scale(24)} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.flatListView}>
        {loading ? (
          <ActivityIndicator size="large" color="#041E42" />
        ) : (
          <FlatList
            renderItem={renderItem}
            data={bookData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Homescreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    width: scale(290),
    fontSize: scale(17),
    color: '#041E42'
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
    marginTop: scale(10),
    borderRadius: scale(5),
    padding: scale(5),
    width: scale(330),
    alignSelf: 'center',
  },
  flatListView: {
    marginBottom: scale(75),
  },
  coverImages: {
    height: scale(130),
    width: scale(100),
    marginLeft: scale(10), 
  },
  renderItem: {
    marginLeft: scale(10),
    marginRight: scale(10),
    marginTop: scale(10),
    backgroundColor: '#F8F8F8',
    padding: scale(10),
    borderRadius: scale(5),
    elevation: 1,
  },
  bookTitle: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#041E42',
    flexShrink: 1,
  },
  bookAuthor: {
    fontSize: scale(14),
    color: '#041E42',
    marginLeft: scale(5),
  },
  bookTitleView: {
    marginBottom: scale(5),
  },
  authorView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(5),
  },
  publishYearView: {
    marginTop: scale(5),
    flexDirection:'row'
  },
  publishYearText: {
    fontSize: scale(12),
    color: 'gray',
  },
  yearText:{
    fontSize: scale(12),
    color: '#041E42',
  }
});
