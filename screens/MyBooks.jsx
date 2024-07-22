import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'
import axiosInstance from '../assets/utils/axiosConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MyBooks = ({ navigation }) => {
    const [email, setUserEmail] = useState('');
    const [data, setData] = useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                if(email)
                setUserEmail(email);
            } catch (err) {
                console.log(err);
            }
        };
        getUserEmail();
    }, []);

    useEffect(() => {
        const getCollections = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance('/getCurrentCollections', {
                    params: { email: email }
                });
                console.log(response.data);
                setData(response.data);
            } catch (err) {
                console.log(err);
            }
            finally{
                setLoading(false)
            }
        };

        if (email) {
            getCollections();
        }
    }, [email]);

    const onPressHandler=(item)=>{
        navigation.navigate('CreatedBookView',{item, email})
    }

    const renderItem = ({ item }) => {
        const defaultImage = 'https://via.placeholder.com/100x160.png?text=No+Image';
        return (
          <TouchableOpacity 
          style={styles.renderItem}
          onPress={()=>onPressHandler(item)}>
            <View style={{ flexDirection: 'row', gap: scale(20) }}>
              <Image
                source={{ uri: item.coverImage || defaultImage }}
                style={styles.coverImages}
                resizeMode='contain'
              />
              <View style={{ flex: 1, width:scale(50) }}>
                <View style={styles.bookTitleView}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                </View>
                <View style={styles.authorView}>
                  <Text style={{ color: 'gray', fontSize: scale(14) }}>by</Text>
                  <Text style={styles.bookAuthor}>{item.author}</Text>
                </View>
                <View style={styles.publishYearView}>
                  <Text style={styles.publishYearText}>Genre:</Text>
                  <Text style={styles.yearText}> {item.genre || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.touchableView}>
                        <TouchableOpacity>
                            <Text style={styles.touchableText}>
                                Favourites
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
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CreateBook')
                            }}>
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
                        My Collections!
                    </Text>
                </View>
                <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id.toString()}
                        style={{marginBottom:scale(200)}}
                    />
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
        fontSize: scale(24),
        textDecorationLine: 'underline',
        marginBottom:scale(10)
    },
    favTextView: {
        alignContent: 'flex-start',
        marginTop: scale(20),
        marginLeft: scale(20)
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
    width:scale(160)
  },
  publishYearView: {
    marginTop: scale(5),
    flexDirection:'row'
  },
  publishYearText: {
    fontSize: scale(12),
    color: 'gray',
  },
  yearText:{
    fontSize: scale(12),
    color: '#041E42',
  },
  coverImages: {
    height: scale(100),
    width: scale(100),
    marginLeft: scale(10), 
  },
})
