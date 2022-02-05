import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Layer extends React.Component{
  render(){
    return(
      <View style={styles.main}>
        <View style={styles.row}>
          <View style={[styles.pixel, {backgroundColor:'pink'}]}/>
          <View style={[styles.pixel, {backgroundColor:'red'}]}/>
          <View style={[styles.pixel, {backgroundColor:'blue'}]}/>
        </View>
        <View style={styles.row}>
          <View style={[styles.pixel, {backgroundColor:'black'}]}/>
          <View style={[styles.pixel, {backgroundColor:'white'}]}/>
          <View style={[styles.pixel, {backgroundColor:'pink'}]}/>
        </View>        
        <View style={styles.row}>
          <View style={[styles.pixel, {backgroundColor:'yellow'}]}/>
          <View style={[styles.pixel, {backgroundColor:'orange'}]}/>
          <View style={[styles.pixel, {backgroundColor:'green'}]}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex:1,
  },

  row:{
    flex:1,
    flexDirection:"row",
  },

  pixel:{
    flex:1,
  }
});