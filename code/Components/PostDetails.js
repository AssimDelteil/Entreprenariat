
import React from 'react'
import { StyleSheet, View, Text, Image,TextInput, TouchableOpacity} from 'react-native'



class PostDetails extends React.Component {



  render() {
    console.log(this.props.navigation.state.params.post)
    const post = this.props.navigation.state.params.post
    return (
        <View style={styles.container} >

            <View style={styles.header_container}>
                <Text style={styles.title_text}>{post.user}</Text>
                <Text style={styles.dateheure_text}>{post.date}</Text>
            </View>

            <View style={styles.image}>
                <Image
                    style={styles.image}
                    source={post.picture}
                />
            </View>

            <View style={styles.likes_container}>

                <TouchableOpacity title="Likes" onPress={() => {console.log('Pressed')}} style={styles.image_likes}>
                    <Image
                            style={styles.image_likes}
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
                <Text style={styles.description_text}>{post.description}</Text>   
            </View>

            {/* <View style={styles.commentaire_container}>
                <Text style={styles.commentaire_utilisateur}>Utilisateur 1</Text>
                <Text style={styles.commentaire_text}>Ceci est un commentaire</Text>
                <TextInput style={styles.textinput_container} placeholder='Ecrivez un commentaire' />
            </View> */}


        </View>
    )
  }
}




const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5
    },
    
    main_container: {
      height: 190,
      flexDirection: 'column'
    },
  
    header_container: {
        flexDirection: 'row',
        marginTop:15,
    },

    image: {
      height: 200,
      width:"100%",
    },
    description_text: {
        fontStyle: 'italic',
        fontSize: 18,
        color: '#666666',
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
        width: 30,
        height: 30,
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
    commentaire_utilisateur: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 20,
      flexWrap: 'wrap',
      paddingRight: 5
    },
    textinput_container:{
        flex: 1
    },
    content_container: {
      flex: 1,
      margin: 5
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
        height: 200
    },
    date_container: {
      flex: 1
    },
    date_text: {
      textAlign: 'right',
      fontSize: 14
    }
  })

  export default PostDetails
  









