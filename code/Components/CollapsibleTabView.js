import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import PostItem from './PostItem';
import feed from '../Helpers/FeedData';




const TabBarHeight = 48;
const HeaderHeight = 300;
const tab1ItemSize = (Dimensions.get('window').width - 30) / 3;
const tab2ItemSize = (Dimensions.get('window').width - 40) ;





const TabScene = ({
  numCols,
  data,
  renderItem,
  onGetRef,
  scrollY,
  onScrollEndDrag,
  onMomentumScrollEnd,
  onMomentumScrollBegin,
}) => {
  const windowHeight = Dimensions.get('window').height;

  return (
    <Animated.FlatList
      scrollToOverflowEnabled={true}
      numColumns={numCols}
      ref={onGetRef}
      scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      })}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ItemSeparatorComponent={() => <View style={{height: 10}} />}
      ListHeaderComponent={() => <View style={{height: 10}} />}
      contentContainerStyle={{
        paddingTop: HeaderHeight + TabBarHeight,
        paddingHorizontal: 10,
        minHeight: windowHeight - TabBarHeight,
      }}
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};



const CollapsibleTabView = () => {
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'Gallery'},
    {key: 'tab3', title: 'Feed'},
    {key: 'tab2', title: 'Commissions'},
  ]);
  const [tab1Data] = useState(Array(40).fill(0));
  const [tab2Data] = useState(Array(30).fill(0));
  const [tab3Data] = useState(Array(30).fill(0));
  const scrollY = useRef(new Animated.Value(0)).current;
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  let isListGliding = useRef(false);

  useEffect(() => {
    scrollY.addListener(({value}) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  const syncScrollOffset = () => {
    const curRouteKey = routes[tabIndex].key;
    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };




  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };



  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };



  const onScrollEndDrag = () => {
    syncScrollOffset();
  };



  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View style={[styles.header, {transform: [{translateY: y}]}]}>
        <Text style={{fontWeight: "bold"}}>@Delta93500</Text>

        <Image style={styles.image}
            source={require('../Images/profile_pic.png')}
        />

        <Text>Coucou ! Je suis nouveau ici et j'espère me faire pleins d'amis :D </Text>  
        <View style={{flexDirection: 'row'}} >
            <TouchableOpacity onPress={() => {console.log('Pressed')}}>
                <Image style={{height: 38, width: 38}} source={require('../Images/followers.png')} />
                <Text style={{fontWeight: "bold",textAlign: 'center'}}>100</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {console.log('Pressed')}}>
                <Image style={{height: 40, width: 40}} source={require('../Images/followings.png')} />
                <Text style={{fontWeight: "bold",textAlign: 'center'}}>230</Text>
            </TouchableOpacity>
        </View> 

      </Animated.View>
    );
  };



  _displayDetailForPost = (idPost) => {
    console.log("Display post with id " + idPost)
    this.props.navigation.navigate("PostDetails")
  }



  const renderTab1Item = ({index}) => {
    return (
      <TouchableOpacity 
      data={feed}
      keyExtractor={(item) => item.id.toString()} 
      renderItem={({item}) => <PostItem post={item} displayDetailForPost={this._displayDetailForPost} />}
      >
        <View
          style={{
            borderRadius: 16,
            marginLeft: index % 3 === 0 ? 0 : 5,
            width: tab1ItemSize,
            height: tab1ItemSize,
            backgroundColor: '#aaa',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress= {() => <PostItem post={item} displayDetailForPost={this._displayDetailForPost} />}
        >
          <Text>{ }</Text>
        </View>
      </TouchableOpacity>
    );
  };



  const renderTab2Item = ({index}) => {
    return (
      <TouchableOpacity onPress={() => this._displayDetailForPost }>
        <View
          style={{
            marginLeft: 10,
            borderRadius: 16,
            width: tab2ItemSize,
            height: 200,
            backgroundColor: '#aaa',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{ }</Text>
        </View>
      </TouchableOpacity>
    );
  };



  const renderTab3Item = ({index}) => {
    return (
      <TouchableOpacity onPress={() => console.log('Pressed') }>
        <View
          style={{
            marginLeft: 10,
            borderRadius: 16,
            width: tab2ItemSize,
            height: tab2ItemSize,
            backgroundColor: '#aaa',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{ }</Text>
        </View>
      </TouchableOpacity>
    );
  };



  const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };




  const renderScene = ({route}) => {
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case 'tab1':
        numCols = 3;
        data = tab1Data;
        renderItem = renderTab1Item;
        break;
      case 'tab2':
        numCols = 1;
        data = tab2Data;
        renderItem = renderTab2Item;
        break;
      case 'tab3':
        numCols = 1;
        data = tab3Data;
        renderItem = renderTab3Item;
        break;
      default:
        return null;
    }
    return (
      <TabScene
        numCols={numCols}
        data={data}
        renderItem={renderItem}
        scrollY={scrollY}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onGetRef={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
      />
    );
  };




  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{translateY: y}],
          width: '100%',
        }}>
        <TabBar
          {...props}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };



  const renderTabView = () => {
    return (
      <TabView
        onIndexChange={(index) => setIndex(index)}
        navigationState={{index: tabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: Dimensions.get('window').width,
        }}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderTabView()}
      {renderHeader()}
    </View>
  );
};



const styles = StyleSheet.create({
    
  image: {
      height: 100,
      width: 100,
      margin: 5
  },
  header: {
    top: 0,
    height: HeaderHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  label: {fontSize: 16, color: '#222'},
  tab: {elevation: 0, shadowOpacity: 0, backgroundColor: '#e9f2f1'},
  indicator: {backgroundColor: '#222'},
});

export default CollapsibleTabView;