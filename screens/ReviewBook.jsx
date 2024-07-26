import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { scale } from 'react-native-size-matters';
import StarRating from 'react-native-star-rating-widget';

const ReviewBook = () => {
    const [starRating, setStarRating] = useState(0);
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
                <Text style={styles.textHeading}></Text>
            </View>
        </SafeAreaView>
    )
}

export default ReviewBook

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

})