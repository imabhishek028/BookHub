import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axiosInstance from '../assets/utils/axiosConfig';
import { scale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import cheerio from 'cheerio';
import {GOOGLEAPI_KEY} from '@env'

const BookDetails = ({ navigation, route }) => {
    const { clickedBookId } = route.params;
    const [email, setUserEmail] = useState('');
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('userEmail');
                if (storedEmail) setUserEmail(storedEmail);
                getBookDetails(storedEmail);
            } catch (err) {
                console.log(err);
            }
        };
        getUserEmail();
    }, []);

    const getBookDetails = async (email) => {
        try {
            const response = await axiosInstance.get(`https://www.googleapis.com/books/v1/volumes/${clickedBookId}`, {
                params: {
                    key: GOOGLEAPI_KEY
                }
            });
            const bookInfo = response.data.volumeInfo;
            const saleInfo = response.data.saleInfo;
            const bookDetails = {
                title: bookInfo.title,
                author: bookInfo.authors ? bookInfo.authors[0] : 'Unknown Author',
                publishedDate: bookInfo.publishedDate,
                description: bookInfo.description,
                coverImage: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : null,
                price: saleInfo.listPrice ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}` : 'Book not for sale',
            };

            setBookData(bookDetails);

            const checkResponse = await axiosInstance.get('/checkIfFav', {
                params: {
                    email: email,
                    bookId: clickedBookId
                }
            });
            setIsFavourite(checkResponse.data.isFavourite);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPressReviews = () => {
        navigation.navigate('Reviews', { clickedBookId });
    };

    const addToFavourites = async () => {
        try {
            await axiosInstance.post('/addToFav', {
                email: email,
                bookId: clickedBookId
            });
            setIsFavourite(true);
            Alert.alert('Added to Favourites!', 'The book has now been added to favourites');
        } catch (error) {
            console.error('Error adding to favourites:', error);
        }
    };

    const removeFromFavourites = async () => {
        try {
            await axiosInstance.delete('/removeFromFav', {
                data: {
                    email: email,
                    bookId: clickedBookId
                }
            });
            setIsFavourite(false);
            Alert.alert('Removed from Favourites!', 'The book has now been removed from favourites');
        } catch (error) {
            console.error('Error removing from favourites:', error);
        }
    };

    const handleFavouriteToggle = () => {
        if (isFavourite) {
            removeFromFavourites();
        } else {
            addToFavourites();
        }
    };

    const onPressBuy = async () => {
        try {
            await axiosInstance.post('/buyBook', {
                email: email,
                bookId: clickedBookId
            });
            setIsFavourite(true);
            Alert.alert('Purchased!', 'The book has now been added to buy history');
        } catch (error) {
            console.error('Error buying book', error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#041E42" />
            </SafeAreaView>
        );
    }

    if (!bookData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Failed to load book details.</Text>
            </SafeAreaView>
        );
    }

    const onPressReview = () => {
        navigation.navigate('Review', { email, clickedBookId });
    };

    const parseDescription = (html) => {
        const $ = cheerio.load(html);
        return $.text();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {bookData.coverImage && (
                    <Image source={{ uri: bookData.coverImage }} style={styles.coverImage} />
                )}
                <Text style={styles.title}>
                    {bookData.title}
                </Text>
                <Text style={styles.author}>
                    {bookData.author}
                </Text>
                <Text style={styles.publishedDate}>
                    {bookData.publishedDate}
                </Text>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        {parseDescription(bookData.description)}
                    </Text>
                </View>
                <Text style={styles.price}>
                    {bookData.price}
                </Text>
                <TouchableOpacity
                    style={styles.favouriteButton}
                    onPress={handleFavouriteToggle}
                >
                    <Text style={styles.favouriteButtonText}>
                        {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.favouriteButton}
                    onPress={onPressBuy}
                >
                    <Text style={styles.favouriteButtonText}>
                        Buy
                    </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={onPressReviews}>
                        <Text style={styles.ReviewText}>
                            Reviews
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: scale(220) }}
                        onPress={onPressReview}>
                        <FontAwesome5 name='pen' size={18} color={'#000000'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: scale(20),
        alignItems: 'center',
    },
    coverImage: {
        width: scale(150),
        height: scale(220),
        resizeMode: 'cover',
        marginBottom: scale(20),
        borderRadius: scale(5),
        borderWidth: 5,
        borderColor: '#000000',
    },
    title: {
        fontSize: scale(24),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: scale(10),
        color: '#041E42',
    },
    author: {
        fontSize: scale(18),
        color: '#808080',
        textAlign: 'center',
        marginBottom: scale(10),
    },
    publishedDate: {
        fontSize: scale(16),
        color: '#808080',
        textAlign: 'center',
        marginBottom: scale(20),
    },
    descriptionContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: scale(10),
        marginBottom: scale(10),
        borderRadius: scale(10),
        elevation: 2,
    },
    description: {
        fontSize: scale(16),
        color: '#000000',
        textAlign: 'left',
        lineHeight: scale(22),
        padding: scale(10),
    },
    price: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#00FF00',
        textAlign: 'center',
        marginBottom: scale(20),
    },
    favouriteButton: {
        backgroundColor: '#041E42',
        borderRadius: scale(5),
        padding: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(10),
    },
    favouriteButtonText: {
        color: '#FFFFFF',
        fontSize: scale(16),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: scale(18),
        color: '#FF0000',
        textAlign: 'center',
    },
    ReviewText: {
        color: '#041E42',
        fontWeight: 'bold',
        fontSize: scale(18),
        textDecorationLine: 'underline',
        marginBottom: scale(10),
    },
});
