// Navigation/Navigation.js

import React from 'react'
import {Image, StyleSheet} from 'react-native'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Draw from '../Components/Draw'
import Gallery from '../Components/Gallery'

const SearchStackNavigator = createStackNavigator({
  Gallery: { 
    screen: Gallery,
    navigationOptions: {
      title: 'Gallery'
    }
  },

  Draw: { 
    screen: Draw,
    navigationOptions: {
      title: 'Draw'
    }
  },
})


export default createAppContainer(SearchStackNavigator) 