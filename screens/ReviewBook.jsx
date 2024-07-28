import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import StarRating from 'react-native-star-rating-widget';
import axiosInstance from '../assets/utils/axiosConfig';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ReviewBook = ({ navigation, route }) => {
    const { email, clickedBookId } = route.params;
    const [starRating, setStarRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasPreviousReview, setHasPreviousReview] = useState(false);

    useEffect(() => {
        const getCurrentReview = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/getUserReview', {
                    params: {
                        email,
                        bookId: clickedBookId,
                    },
                });

                if (response.status === 200) {
                    const { userReview } = response.data;
                    setStarRating(userReview.rating);
                    setReview(userReview.reviewBody);
                    setHasPreviousReview(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('No existing review found');
                } else {
                    console.error('Error fetching review:', error);
                    Alert.alert('Error', 'Failed to fetch review. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        getCurrentReview();
    }, [email, clickedBookId]);

    const onPressSubmit = async () => {
        if (starRating === 0 || !review) {
            Alert.alert('Review not given!', 'Kindly rate and review.');
        } else {
            setLoading(true);
            try {
                await axiosInstance.post('/review', {
                    email,
                    bookId: clickedBookId,
                    rating: starRating,
                    review,
                });
                Alert.alert('Review added/updated successfully!', 'Your review is now recorded.');
            } catch (error) {
                console.error('Error submitting review:', error);
                Alert.alert('Error', 'Failed to submit the review. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const onPressDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete('/deleteUserReview', {
                data: {
                    email,
                    bookId: clickedBookId,
                },
            });
            setStarRating(0);
            setReview('');
            setHasPreviousReview(false);
            Alert.alert('Review deleted successfully!', 'Your review has been removed.');
        } catch (error) {
            console.error('Error deleting review:', error);
            Alert.alert('Error', 'Failed to delete the review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#041E42" />
            ) : (
                <>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.textHeading}>Rate the Book:</Text>
                        <StarRating
                            rating={starRating}
                            onChange={setStarRating}
                            starSize={scale(35)}
                            color='#041E42'
                        />
                    </View>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.textHeading}>Review the Book:</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder='Enter Book Review'
                            multiline
                            numberOfLines={15}
                            value={review}
                            onChangeText={setReview}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={onPressSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                    {hasPreviousReview && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onPressDelete}>
                            <FontAwesome5 name="trash-alt" size={scale(20)} color="red" />
                        </TouchableOpacity>
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

export default ReviewBook;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
    },
    ratingContainer: {
        padding: scale(10),
        alignItems: 'center',
    },
    textHeading: {
        color: '#041E42',
        fontSize: scale(22),
        padding: scale(5),
        fontWeight: 'bold',
    },
    descriptionInput: {
        height: scale(250),
        textAlignVertical: 'top',
        padding: scale(10),
    },
    input: {
        height: scale(40),
        width: '100%',
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#F9F9F9',
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        fontSize: scale(18),
        color: '#333333',
    },
    submitButton: {
        backgroundColor: '#041E42',
        marginTop: scale(20),
        height: scale(50),
        width: scale(200),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: scale(10),
    },
    submitText: {
        textAlign: 'center',
        fontSize: scale(20),
        fontWeight: 'bold',
        color: 'white',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(20),
        alignSelf: 'center',
    },
    deleteText: {
        marginLeft: scale(10),
        fontSize: scale(18),
        color: 'red',
    },
});
