import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import axiosInstance from '../assets/utils/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Reviews = ({ navigation, route }) => {
    const { clickedBookId } = route.params;
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance('/getBookReviews', {
                   bookId:clickedBookId,
                })
                setData(res.data.bookReviews)
                console.log(res.data.bookReviews)
            } catch (err) {
                console.log(`Error getting Reviews :${err}`)
            }finally{
                setLoading(false)
            }
        }
        getReviews();
    }, [clickedBookId])


    const renderItem = ({ item }) => {
        return (
            <View style={styles.renderItem}>
            
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
                    keyExtractor={(item) => item._id.toString()}
                    style={{ marginBottom: scale(200) }}
                />
            )}
        </SafeAreaView>
    )
}

export default Reviews

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    touchableView: {
        backgroundColor: '#FFFAFA',
        height: scale(50),
        width: scale(157),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: scale(10),
        elevation: 2,
        borderRadius: scale(10),
    },
    touchableText: {
        color: '#041E42',
        alignSelf: 'center',
        padding: scale(15),
        fontSize: scale(15),
        fontWeight: 'bold',
    },
    favText: {
        color: '#041E42',
        fontWeight: 'bold',
        fontSize: scale(24),
        textDecorationLine: 'underline',
        marginBottom: scale(10),
    },
    favTextView: {
        alignContent: 'flex-start',
        marginTop: scale(20),
        marginLeft: scale(20),
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
        width: scale(160),
    },
    publishYearView: {
        marginTop: scale(5),
        flexDirection: 'row',
    },
    publishYearText: {
        fontSize: scale(12),
        color: 'gray',
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
})