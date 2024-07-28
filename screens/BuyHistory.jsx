import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import axiosInstance from '../assets/utils/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BuyHistory = () => {
  const [email, setUserEmail] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchEmailAndData = async () => {
        try {
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) {
            setUserEmail(storedEmail);
            setLoading(true);
            const response = await axiosInstance('/getBuyHistory', {
              params: { email: storedEmail }
            });
            const bookIds = response.data;

            const bookDetailsPromises = bookIds.map(async (item) => {
              const defaultImage = 'https://via.placeholder.com/100x160.png?text=No+Image';
              const response = await axiosInstance.get(`https://www.googleapis.com/books/v1/volumes/${item.bookId}`, {
                params: {
                  key: 'AIzaSyCVp6vomUM6vgWDss0MEVy8UBYhkiFf27s'
                }
              });
              const bookInfo = response.data.volumeInfo;
              const saleInfo = response.data.saleInfo;
              return {
                id: item.bookId,
                title: bookInfo.title,
                author: bookInfo.authors ? bookInfo.authors[0] : 'Unknown Author',
                publishedDate: bookInfo.publishedDate ? bookInfo.publishedDate : 'N/A',
                description: bookInfo.description,
                coverImage: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : defaultImage,
                price: saleInfo.listPrice ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}` : 'Book not for sale',
              };
            });
            const bookDetails = await Promise.all(bookDetailsPromises);
            setBooks(bookDetails);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEmailAndData();
    }, [])
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View
          style={styles.renderItem}>
          <View style={{ flexDirection: 'row', gap: scale(20) }}>
            <Image
              source={{ uri: item.coverImage }}
              style={styles.coverImages}
              resizeMode='contain'
            />
            <View style={{ flex: 1, width: scale(50) }}>
              <View style={styles.bookTitleView}>
                <Text style={styles.bookTitle}>{item.title}</Text>
              </View>
              <View style={styles.authorView}>
                <Text style={{ color: 'gray', fontSize: scale(14) }}>by</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
              </View>
              <View style={styles.publishYearView}>
                <Text style={styles.publishYearText}>Published on:</Text>
                <Text style={styles.yearText}>{item.publishedDate}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#041E42" />
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

export default BuyHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  renderItem: {
    marginLeft: scale(10),
    marginRight: scale(10),
    marginTop: scale(10),
    backgroundColor: '#F8F8F8',
    padding: scale(10),
    borderRadius: scale(5),
    elevation: 2,
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
    width: scale(160),
  },
  publishYearView: {
    marginTop: scale(5),
    flexDirection: 'row',
    gap:5
  },
  publishYearText: {
    fontSize: scale(12),
    color: '#808080',
  },
  yearText: {
    fontSize: scale(12),
    color: '#041E42',
  },
  coverImages: {
    height: scale(100),
    width: scale(100),
    marginLeft: scale(10),
  },
});