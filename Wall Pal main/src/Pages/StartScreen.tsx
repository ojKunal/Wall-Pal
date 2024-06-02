import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Image} from 'react-native';
const {height} = Dimensions.get('window');
import logo from '../../assets/logo.png';

const StartScreen = ({navigation}: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
      // finish();
    }, 1000);
  }, []);
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
      }}>
      <Image
        source={logo}
        style={{
          height: 200,
          width: 200,
        }}
      />
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: 'black',
          marginTop: -15,
        }}>
        WALLIFY
      </Text>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({});
