
import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Feed from '../Components/Feed'
import PostDetails from '../Components/PostDetails';
import { Image, TouchableOpacity, TextInput } from 'react-native';

const UserStackNavigator = createStackNavigator({
    Feed: { 
      screen: Feed,
      navigationOptions: {
        headerTitle: () => <TextInput style={{marginLeft : 20,
          height: 35, 
          borderColor: '#000000', 
          borderWidth: 0.5, 
          paddingLeft: 5}} placeholder='Rechercher un utilisateur'/>,
        headerTitleStyle: { 
            textAlign:"center", 
            flex:1 
        },
        headerLeft: () =><Image source={require('../Images/Ilus.jpg')} style={{marginLeft : 5, width: 50, height: 43}} />,
        headerTintColor: 'blue',
        headerRight: () => <TouchableOpacity title="settings" onPress={() => {console.log('Pressed')}}><Image source={require('../Images/Settings.png')} style={{width: 40, height: 40}} /></TouchableOpacity>
      }
    },
    PostDetails: { 
      screen: PostDetails
    }
  })

export default createAppContainer(UserStackNavigator)