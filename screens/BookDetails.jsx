import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const BookDetails = ({navigation,route}) => {
    const {clickedBookId}=route.params;

    const [bookData,setBookData]=useState()

    useEffect(() => {
        const getBookDetails = async () => {
            try {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${clickedBookId}`, {
                  params: {
                    key: 'AIzaSyCVp6vomUM6vgWDss0MEVy8UBYhkiFf27s'
                  }
                });
                const title=response.data.volumeInfo.title
                const author=response.data.volumeInfo.authors[0]
                const publishedDate=response.data.volumeInfo.publishedDate
                const description=response.data.volumeInfo.description
                const coverImage=response.data.volumeInfo.imageLinks ? response.data.volumeInfo.imageLinks.thumbnail : null
                const price=response.data.saleInfo.listPrice ? `${response.data.saleInfo.listPrice.amount} ${response.data.listPrice.currencyCode}` : 'Book not for sale'
                console.log(description)
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        }
        getBookDetails();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>
                    in progress
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default BookDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})