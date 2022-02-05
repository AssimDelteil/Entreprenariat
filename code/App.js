import React from 'react';
import { View,StyleSheet, TouchableOpacity, Image, Text, Dimensions, FlatList, Touchable} from 'react-native';
import NavigationYouss from "./Navigation/NavigationYouss"
import { Provider } from 'react-redux'
import Store from './Store/configureStore'

export default class App extends React.Component {
  render(){
    return (
      <Provider store={Store}>
        <NavigationYouss/>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  
});