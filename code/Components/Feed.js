import React from 'react'
import { View, FlatList} from 'react-native'
import feed from '../Helpers/FeedData';
import PostItem from './PostItem';

class Feed extends React.Component {

  _displayDetailForPost = (post) => {
    this.props.navigation.navigate("PostDetails", { post: post})
  }

  render() {
    return (
      <View>
        <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
          <FlatList
            data={feed}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <PostItem post={item} displayDetailForPost={this._displayDetailForPost} />}
            ItemSeparatorComponent={() => <View style={{height: 1,width:"80%",alignSelf:"center", borderBottomWidth:1, borderBottomColor:"lightgrey",marginVertical:20}} />}
          />
        </View>

      </View>
    )
 }
}





export default Feed