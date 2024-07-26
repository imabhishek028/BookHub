import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import StarRating from 'react-native-star-rating-widget';
import axiosInstance from '../assets/utils/axiosConfig';

const ReviewBook = ({ navigation, route }) => {
    const { email, clickedBookId } = route.params;
    const [starRating, setStarRating] = useState(0);
    const [review, setReview] = useState('');

    const onPressSubmit = async () => {
        if (starRating === 0 || !review) {
            Alert.alert('Review not given!', 'Kindly rate and review.');
        } else {
            try {
                await axiosInstance.post('/review', {
                    email: email,
                    bookId: clickedBookId,
                    rating: starRating,
                    review: review,
                });
                Alert.alert('Review added successfully!', 'Your review is now recorded.');
            } catch (error) {
                console.error('Error submitting review:', error);
                Alert.alert('Error', 'Failed to submit the review. Please try again.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
        marginTop: scale(70),
        height: scale(50),
        width: scale(200),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: scale(10),
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: scale(19),
        textAlign: 'center',
    },
});
