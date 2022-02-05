// App.js
import React from 'react';
import Draw from './Draw'
import { View,StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Touchable} from 'react-native';

export default class Gallery extends React.Component {
  render(){
    return (
      <View style={{flex:1,flexDirection:"row", backgroundColor:"lightgrey"}}>
        <TouchableOpacity style={{margin:20,width:"40%", height:150, alignItems:"center"}} onPress={() => {this.props.navigation.navigate("Draw")}}>
          <Text style={{textAlign:"center", fontSize:20}}>Projet n°1</Text>
          <Image style={{height:100, width:100, justifyContent:"center", marginTop:10 }} source={require("../Images/projet.jpg")}/>
        </TouchableOpacity>
        <TouchableOpacity style={{margin:20,width:"40%", height:150, alignItems:"center"}} onPress={() => {this.props.navigation.navigate("Draw")}}>
          <Text style={{fontSize:20}}>Nouveau projet</Text>
          <Image style={{height:100, width:100, justifyContent:"center", marginTop:10 }} source={require("../Images/icon_plus.png")}/>
        </TouchableOpacity>
      </View>

    )
  }
}