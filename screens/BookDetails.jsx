import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const BookDetails = () => {

    useEffect(() => {
        const getBookDetails = async () => {
    const bookData=await axios.get('')
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