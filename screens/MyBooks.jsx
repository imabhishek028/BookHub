import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'

const MyBooks = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.touchableView}>
                        <TouchableOpacity>
                            <Text style={styles.touchableText}>
                                My Collections
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.touchableView}>
                        <TouchableOpacity>
                            <Text style={styles.touchableText}>
                                Cart
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.touchableView}>
                        <TouchableOpacity>
                            <Text style={styles.touchableText}>
                                Create Book
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.touchableView}>
                        <TouchableOpacity>
                            <Text style={styles.touchableText}>
                                Buy History
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View>
                <View style={styles.favTextView}>
                    <Text style={styles.favText}>
                        Favourites!
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default MyBooks

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontWeight: 'bold'
    },
    favText: {
        color: '#041E42',
        fontWeight: 'bold',
        fontSize:scale(24),
        textDecorationLine: 'underline',
    },
    favTextView: {
        alignContent: 'flex-start',
        marginTop: scale(20),
        marginLeft: scale(20)
    }
})