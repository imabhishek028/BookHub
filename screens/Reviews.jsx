import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { scale } from 'react-native-size-matters';
import axiosInstance from '../assets/utils/axiosConfig';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reviews = ({ route }) => {
    const { clickedBookId } = route.params;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [email, setUserEmail] = useState('');

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                if (email) setUserEmail(email);
            } catch (err) {
                console.log(err);
            }
        };
        getUserEmail();
    }, []);

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/getBookReviews', {
                    params: {
                        bookId: clickedBookId,
                    },
                });
                setData(res.data.bookReviews.reviews);
            } catch (err) {
                console.log(`Error getting Reviews: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        getReviews();
    }, [clickedBookId]);

    const handleLikeDislike = async (reviewId, action) => {
        try {
            await axiosInstance.post('/updateLikes', {
                email: email,
                bookId: clickedBookId,
                reviewId,
                action,
            });
            setData(prevData =>
                prevData.map(review =>
                    review._id === reviewId
                        ? {
                            ...review,
                            likes: action === 'like' ? review.likes + 1 : review.likes,
                            dislikes: action === 'dislike' ? review.dislikes + 1 : review.dislikes,
                        }
                        : review
                )
            );
        } catch (error) {
            console.log(`Error updating likes/dislikes: ${error}`);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.renderItem}>
                <Text style={styles.emailText}>
                    {item.userid}
                </Text>
                <Text style={styles.reviewText}>
                    {item.reviewBody}
                </Text>
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                        Rating: {item.rating}
                    </Text>
                </View>
                <View style={styles.likeDislikeContainer}>
                    <TouchableOpacity onPress={() => handleLikeDislike(item._id, 'like')}>
                        <FontAwesome5 name="thumbs-up" size={scale(20)} color="green" />
                        <Text style={styles.number}>{item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLikeDislike(item._id, 'dislike')}>
                        <FontAwesome5 name="thumbs-down" size={scale(20)} color="red" />
                        <Text style={styles.number}>{item.dislikes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#041E42" />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item._id.toString()}
                />
            )}
        </SafeAreaView>
    );
};

export default Reviews;

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
        elevation: 1,
    },
    emailText: {
        fontSize: scale(12),
        color: '#ccc',
        marginBottom: scale(5),
    },
    reviewText: {
        fontSize: scale(16),
        color: '#333',
        marginBottom: scale(5),
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(5),
    },
    ratingText: {
        fontSize: scale(14),
        color: '#041E42',
    },
    likeDislikeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: scale(100),
    },
    number: {
        color: '#000000'
    }
});
