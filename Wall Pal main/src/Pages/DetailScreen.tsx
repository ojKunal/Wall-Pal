import { BackHandler, Dimensions, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faDownload,
  faPlay,
  faShareAlt,
} from '@fortawesome/free-solid-svg-icons';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import { Platform } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
const {width, height} = Dimensions.get('window');

const DetailScreen = ({route, navigation}: any) => {
  const {imageUrl} = route.params;
  let extention = imageUrl.lastIndexOf('.');
  let imageName = '/wallify_image_' + Date.now() + imageUrl.substr(extention);

  let dirs = RNFetchBlob.fs.dirs;
  let path =
    Platform.OS === 'ios'
      ? dirs['MainBundleDir'] + imageName
      : dirs.PictureDir + imageName;

  const setAsWallaper = () => {
    ToastAndroid.show('Wallpaper set Succesfully', 300);
  };
  const saveToGallery = () => {
    if (Platform.OS == 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      })
        .fetch('GET', imageUrl)
        .then(res => {
          ToastAndroid.show('Image Downloaded Successfully', 300);
        });
    } else {
      // CameraRoll.saveToCameraRoll(imgUrl);
    }
  };

  const ref = useRef();
  const onShare = async () => {
    try {
      const uri = await captureRef(ref, {
        format: 'png',
        quality: 0.7,
      });
      await Share.open({url: uri});
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        height: height,
      }}>
      <View
        style={{
          height: height,
          width: width,
        }}>

        <ViewShot ref={ref as any} style={{width: width, height: height}}>
        <ImageZoom
          uri={imageUrl}
          style={{width: width, height: height}}
          minScale={0.5}
          maxScale={5}
          doubleTapScale={3}
          minPanPointers={1}
          isSingleTapEnabled
          isDoubleTapEnabled
          resizeMode="cover"
        />
        </ViewShot>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginVertical: 20,
          position: 'absolute',
          bottom: 1,
          gap: 30,
        }}>
        <View style={styles.fab_view}>
          <Pressable
            style={styles.fab_icon}
            onPress={async () => {
              await onShare();
            }}>
            <FontAwesomeIcon icon={faShareAlt} size={22} color="white" />
          </Pressable>
          <Text style={{fontWeight: '500', color:'aqua'}}>Share</Text>
        </View>
        <View style={styles.fab_view}>
          <Pressable style={styles.fab_icon} onPress={setAsWallaper}>
            <FontAwesomeIcon icon={faPlay} size={22} color="#ffffff" />
          </Pressable>
          <Text style={{fontWeight: '500', color:'aqua'}}>Apply</Text>
        </View>

        <View style={styles.fab_view}>
          <Pressable style={styles.fab_icon} onPress={saveToGallery}>
            <FontAwesomeIcon icon={faDownload} size={22} color="white" />
          </Pressable>
          <Text style={{fontWeight: '500', color:'aqua'}}>Download</Text>
        </View>
      </View>

      <Pressable
        style={{position: 'absolute', top: 35, left: 20}}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <View
          style={{
            padding: 6,
            backgroundColor: 'gray',
            borderRadius: 30,
          }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            style={{color: 'white'}}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  fab_icon: {
    backgroundColor: '#AA04B2',
    padding: 18,
    borderRadius: 30,
  },
  fab_view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
