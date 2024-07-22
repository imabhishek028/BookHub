import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters';

const CreatedBooksView = ({ navigation, route }) => {
    const { item } = route.params;
    console.log(item);

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.coverImageView}>
                    <Image
                        source={{ uri: item.coverImage }}
                        style={styles.coverImage}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>
                        {item.title}
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.whatText}>
                            by 
                        </Text>
                        <Text style={styles.author}>
                            {item.author}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.whatText}>
                            Genre:
                        </Text>
                        <Text style={styles.genre}>
                             {item.genre || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default CreatedBooksView

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingVertical: scale(20),
    },
    coverImageView: {
        marginBottom: scale(20),
    },
    coverImage: {
        height: scale(200),
        width: scale(150),
        borderRadius: scale(10),
        resizeMode: 'cover',
        borderWidth: 5,
        borderColor: '#000000'
    },
    detailsContainer: {
        paddingHorizontal: scale(20),
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: scale(24),
        fontWeight: 'bold',
        color: '#041E42',
        textAlign: 'center',
        marginBottom: scale(10),
    },
    author: {
        fontSize: scale(18),
        color: '#041E42',
        textAlign: 'center',
        marginBottom: scale(10),
    },
    genre: {
        fontSize: scale(18),
        color: '#041E42',
        textAlign: 'center',
        marginBottom: scale(10),
    },
    description: {
        fontSize: scale(18),
        color: '#041E42',
        textAlign: 'left',
    },
    whatText: {
        color: '#888888',
        fontSize:scale(16)
    },
    row: {
        flexDirection: 'row',
        gap: scale(5),
        alignItems: 'center',
        marginBottom: scale(5),
    },
    descriptionContainer: {
        padding: scale(10), 
        backgroundColor: '#f8f8f8', 
        borderRadius: scale(10),
        width: '100%',
        elevation:2,
    },
});
