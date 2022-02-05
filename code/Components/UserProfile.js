
import React from 'react'
import { StyleSheet} from 'react-native'
import CollapsibleTabView from './CollapsibleTabView'


class PostDetails extends React.Component {


  render() {
    return (
        <CollapsibleTabView/>
    )
  }
}




const styles = StyleSheet.create({
    
    main_container: {
      marginHorizontal: 5,
      height: 190
    },
  
    header_container : {
        position: 'absolute',
        flex : 1,
        alignItems: 'center',
        borderBottomWidth : 1
    },
    username_style: {
        borderWidth: 1
    },
    image: {
        height: 100,
        width: 100,
        margin: 5
    },
    bio_style: {
        fontStyle: 'italic',
        fontSize: 18,
        color: '#666666',
    },
    
    posts_container : {
      flexDirection: 'column',
      flex : 1
    },






    likes_container: {
        flexDirection: 'row',
        height: 35,
        borderWidth: 1
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

    commentaire_container: {
      height: 100,
      flexDirection: 'column',
      borderBottomWidth: 2,
      borderTopWidth: 2
    },
    commentaire_text: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      flex: 1
    },
    content_container: {
      flex: 1,
      margin: 5
    }
  })

  export default PostDetails
  