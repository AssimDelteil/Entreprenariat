

import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView} from 'react-native'
import { TouchableOpacity } from 'react-native';
import feed from '../Helpers/FeedData';

class PostItem extends React.Component {
  render() {
    const { post, displayDetailForPost } = this.props
    return (
      <View style={styles.mainview_container}>
        <ScrollView style={styles.scrollview_container}>

          <View style={styles.header_container}>
            <Text style={styles.title_text}>{this.props.post.user}</Text>
            <Text style={styles.dateheure_text}>{this.props.post.date}</Text>
          </View>


          
          <TouchableOpacity style={styles.image} onPress={() => displayDetailForPost(post)}>
                <Image
                  style={styles.image}
                  source={this.props.post.picture}
                />
          </TouchableOpacity>


          <View style={styles.likes_container}>

                  <TouchableOpacity title="Likes" onPress={() => {console.log('Pressed')}} style={styles.image_likes}>
                      <Image
                              style={styles.image_likes,{height:30,width:30}}
                              source={require('../Images/ic_favorite_border.png')}
                      />
                  </TouchableOpacity>


                  <Text style={styles.text_likes}>50 Likes</Text>

                  <TouchableOpacity onPress={() => {console.log('Pressed')}} style={styles.image_likes}>
                      <Image
                              style={styles.image_likes}
                              source={require('../Images/share.png')}
                      />
                  </TouchableOpacity>
          </View>

          <View style={styles.description_container}>
            <Text style={styles.description_text} numberOfLines={3}>{this.props.post.description}</Text>
          </View>

          
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollview_container: {
    marginHorizontal: 5
  },
  mainview_container: {
    flex: 1
  },
  header_container: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    height: 200,
    width:"100%",
    flex: 3
  },
  description_text: {
    fontStyle: 'italic',
    fontSize: 18,
    color: '#666666',
    flex: 1
  },


  likes_container: {
    flexDirection: 'row',
    height: 35,
  },
  text_likes: {
      flex: 11,
      fontSize: 20
  },
  image_likes: {
      width: null,
      height: null,
      flex: 1
  },
  image_share: {
      width: null,
      height: null,
      flex: 1
  },


  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  dateheure_text: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#666666'
  },
  description_container: {
    flex: 7
  },
  date_container: {
    flex: 1
  }
})

export default PostItem