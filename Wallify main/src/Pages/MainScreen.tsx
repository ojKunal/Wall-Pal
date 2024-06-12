import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { IImageDetails } from '../Intefaces/image';
import { categories } from '../../assets/categories';
import { RefreshControl } from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');
const columnCount = 3;
const imageWidth = width / columnCount;

type IDisplayImage = {
  navigation: any;
};

const MainScreen = ({navigation}: IDisplayImage) => {
  const [imageData, setImageData] = useState<IImageDetails[]>([]);
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');

  const [category, setCategory] = useState<string>('');

  const [activeTab, setActiveTab] = useState<number>(0);
  const [pageNo, setPageNo] = useState<number>(1);

  const [searchBar, setSearchBar] = useState<Boolean>(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(null);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getImages = async (newCat: boolean) => {
    const apiKey = '42964411-a8eb295fb7f217fd70952cc3c';
    const pixaUrl = `https://pixabay.com/api/?key=${apiKey}&q=${category}&page=${pageNo}&image_type=photo&orientation=vertical`;
    try {
      const response = await fetch(pixaUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      let newImageData: IImageDetails[] = [];
      data.hits.map((hit: any) => {
        newImageData.push({
          previewUrl: hit.previewURL,
          imageUrl: hit.largeImageURL,
        });
      });
      if (newCat === true) setImageData(newImageData);
      else setImageData([...imageData, ...newImageData]);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    // console.log(searchQuery);
    getImages(true);
  }, [category]);

  const handleLoadNext = () => {
    setPageNo(pageNo + 1);
    getImages(false);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function refreshPage() {
    Dimensions.get('window')
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.headingText}>Wallify</Text>
        <Pressable onPress={() => setSearchBar(!searchBar)}>
          <FontAwesomeIcon
            icon={searchBar ? faX : faSearch}
            size={20}
            color="white"
          />
        </Pressable>
      </View>
      {searchBar ? (
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
          }}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setTempSearchQuery(text)}
            value={tempSearchQuery}
            onSubmitEditing={() => {
              setCategory(tempSearchQuery);
              setActiveTab(-1);
            }}
            placeholder="Search Wallappers"
            placeholderTextColor={'white'}></TextInput>
        </View>
      ) : null}

      <View style={styles.middleContainer}>
        <ScrollView horizontal={true}>
          {categories.map((category, index) => {
            return (
              <View
                style={{marginHorizontal: 10, alignItems: 'center'}}
                key={index}>
                <Shadow>
                  <Image
                    style={styles.scrollImg}
                    source={category.imgUrl}
                    resizeMode="cover"
                  />
                </Shadow>
                <Pressable
                  key={index}
                  style={[
                    styles.scrollTypes,
                    activeTab === index && {
                      shadowColor: 'purple',
                      shadowRadius: 10,
                    },
                  ]}
                  onPress={() => {
                    setCategory(category.category);
                    setActiveTab(index);
                    setTempSearchQuery('');
                    setPageNo(1);
                    
                    
                  }}>
                 
                  <Text
                    style={[
                      styles.scrollText,
                      activeTab === index && {
                        color: 'yellow',
                      },
                    ]}>
                    {category.name}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {imageData?.length > 0 ? (
        <FlatList
          data={imageData}
          style={styles.flatlist}
          onScrollEndDrag={handleLoadNext}
          renderItem={image => (
            <Pressable
              onPress={() => {
                navigation.navigate('Details', {
                  imageUrl: image.item.imageUrl,
                });
              }}>
              <Image style={styles.photo} source={{uri: image.item.imageUrl}} />
            </Pressable>
          )}
          numColumns={2}
          ListFooterComponent={<Text>Loading...</Text>} // Loader when loading next page.
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white'}}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E6E6FA',
  },

  topContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'purple',
  },

  headingText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lugrasimo Regular',
  },
  middleContainer: {
    marginTop: 12,
    // margin: 10,
    // backgroundColor: 'red',
  },

  scrollTypes: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    borderRadius: 30,
    position: 'absolute',
    minWidth: 140,
    // height: 43,
    height: 80,
    width: 140,
  },

  scrollImg: {
    borderRadius: 10,
    height: 80,
    width: 140,
  },

  scrollText: {
    color: 'white',
    fontSize: 23,
    fontWeight: '600',
  },

  bottomContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photo: {
    height: 230,
    borderRadius: 10,
    width: width * 0.5 - 16,
    margin: 4,
  },
  text: {
    color: 'white',
  },
  flatlist: {
    margin: 8,
  },
  textInput: {
    backgroundColor: '#707070',
    color: 'white',
    fontSize: 18,
    borderRadius: 10,
    width: '90%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
