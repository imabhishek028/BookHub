import { SafeAreaView, StyleSheet, Text, View, StatusBar, TextInput, Keyboard, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { scale } from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const Homescreen = ({navigation}) => {

  const [search, setSearch] = useState('');
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPressSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: search,
          maxResults: 20,
          key: 'AIzaSyCVp6vomUM6vgWDss0MEVy8UBYhkiFf27s'
        }
      });
      const books = response.data.items.map(item => ({
        objectid:item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description || 'No description available',
        coverImage: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
        price: item.saleInfo.listPrice ? `${item.saleInfo.listPrice.amount} ${item.saleInfo.listPrice.currencyCode}` : 'Price not available',
        rating: item.volumeInfo.averageRating || 'No rating',
        ratingsCount: item.volumeInfo.ratingsCount || '0',
      }));
      setBookData(books);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const onPressHandler=(item)=>{
    const clickedBookId=item.objectid
    console.log(clickedBookId)
     navigation.navigate('BookDetails',{clickedBookId})
  }

  const renderItem = ({ item }) => {
    const defaultImage = 'https://via.placeholder.com/100x160.png?text=No+Image';
    return (
      <TouchableOpacity 
      style={styles.renderItem}
      onPress={()=>onPressHandler(item)}>
        <View style={{ flexDirection: 'row', gap: scale(20) }}>
          <Image
            source={{ uri: item.coverImage || defaultImage }}
            style={styles.coverImages}
            resizeMode='contain'
          />
          <View style={{ flex: 1, width:scale(50) }}>
            <View style={styles.bookTitleView}>
              <Text style={styles.bookTitle}>{item.title}</Text>
            </View>
            <View style={styles.authorView}>
              <Text style={{ color: 'gray', fontSize: scale(14) }}>by</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <View style={styles.publishYearView}>
              <Text style={styles.publishYearText}>Published:</Text>
              <Text style={styles.yearText}> {item.publishedDate || 'N/A'}</Text>
            </View>
            <View style={styles.ratingView}>
              <Text style={styles.ratingText}>Rating:</Text>
              <Text style={styles.ratingValue}>{item.rating}</Text>
              <Text style={styles.ratingCount}>({item.ratingsCount})</Text>
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
          placeholder='Search Book or Author...'
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
    width:scale(160)
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
  },
  ratingView: {
    marginTop: scale(5),
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: scale(12),
    color: 'gray',
  },
  ratingValue: {
    fontSize: scale(12),
    color: '#041E42',
    marginLeft: scale(5),
  },
  ratingCount: {
    fontSize: scale(12),
    color: 'gray',
    marginLeft: scale(5),
  }
});
