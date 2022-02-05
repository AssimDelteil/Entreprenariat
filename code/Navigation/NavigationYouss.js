import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Image,  StyleSheet } from 'react-native';

import Feed from '../Components/Feed'
import UserProfile from '../Components/UserProfile';
import Gallery from '../Components/Gallery';
import Draw from '../Components/Draw';
import Explore from '../Components/Explore';
import Paint from '../Components/Paint';
import PostDetails from '../Components/PostDetails';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Settings from '../Components/Settings';

const navOptions =  {
  headerTitle: () => <TextInput style={styles.header_title} placeholder='Rechercher un utilisateur'/>,
  headerTitleStyle: { 
      textAlign:"center", 
      flex:1 
  },
  headerLeft: () => <Image source={require('../Images/Ilus.jpg')} style={styles.header_left} />,
  headerTintColor: 'blue',
  headerRight: () => <TouchableOpacity title="settings" onPress={() => {alert('Settings button')}} ><Image source={require('../Images/Settings.png')} style={{width: 40, height: 40}} /></TouchableOpacity>
}

const FeedStackNavigator = createStackNavigator({
  Feed: { 
    screen: Feed,
    navigationOptions: navOptions
  },
  PostDetails: { 
    screen: PostDetails,
    navigationOptions: navOptions
  },
  Settings: {
    screen: Settings,
    navigationOptions: navOptions
  },
  Explore: {
    screen: Explore
  }
  
})

const ExploreStackNavigator = createStackNavigator({
  Explore: { 
    screen: Explore,
    navigationOptions: navOptions
  }
})

const UserProfileStackNavigator = createStackNavigator({
  UserProfile: { 
    screen: UserProfile,
    navigationOptions: navOptions
  }
})

const GalleryStackNavigator = createStackNavigator({
  Gallery: { 
    screen: Gallery,
    navigationOptions:navOptions
  },

  Draw: { 
    screen: Draw,
    navigationOptions: {
      title: 'Draw', 
    }
  },
})

const IlusTabNavigator = createBottomTabNavigator({

    Feed: {
      screen: FeedStackNavigator,
      navigationOptions: {
        tabBarIcon: () => { 
          return <Image
            source={require('../Images/feed.png')}
            style={styles.icon}/>
        }
      }
    },

    Explore: {
      screen: ExploreStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return <Image
            source={require('../Images/explore.png')}
            style={styles.iconexplore}/>
        }
      }
    },

    Paint: {
      screen: GalleryStackNavigator, 
      navigationOptions: {
        tabBarIcon: () => {
          return <Image
            source={require('../Images/paint.png')}
            style={styles.iconpaint}/>
        },
      }
    },

    UserProfile: {
      screen: UserProfileStackNavigator,
      navigationOptions: {
        tabBarIcon: () => {
          return <Image
            source={require('../Images/profile.png')}
            style={styles.icon}/>
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
      inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
      showLabel: false, // On masque les titres
      showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    }
  }
)

const styles = StyleSheet.create({
  header_title: {
    marginLeft : 20,
    height: 35, 
    borderColor: '#000000', 
    borderWidth: 0.5, 
    paddingLeft: 5
  },
  header_left: {
    marginLeft : 5, 
    width: 50, 
    height: 43
  },
  icon: {
    width: 30,
    height: 30
  },
  iconexplore: {
    width: 27,
    height: 27
  },
  iconpaint: {
    width: 45,
    height: 45
  }
})

export default createAppContainer(IlusTabNavigator)
