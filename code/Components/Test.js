import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

const ANIMALS = ['Dog', 'Cat', 'Chicken', 'Dragon', 'Camel',"Bite","Mais","ou","est","donc"];

export default class Test extends React.Component{
  numberOfLayer=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  render(){
    return (
    <View style={styles.container}>
                <FlatList 
          horizontal={true}
          data={this.numberOfLayer}
          keyExtractor={(item, index) => {return(index.toString())}} 
          renderItem={(item,index) => {
            return(
            <Text style={styles.miniLayer}>{item.index}</Text>
            )}} /> 
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    paddingTop: 100,
  },
  listItem: {
    backgroundColor: 'orange',
    borderWidth: 1,
    borderColor: '#333',
    padding: 25,
  }
});
