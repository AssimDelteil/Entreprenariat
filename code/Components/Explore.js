

import React, { Component } from 'react';
import { Text, Alert, Button, View, StyleSheet, TextInput,TouchableOpacity, Image } from 'react-native';

export default class Explore extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
    };
  }

  go = () => {
           const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(this.state.email) === true){
               alert('valid');
           }
           else{
               alert();
           }
 
  }
  
  onLogin() {
    const { username, password } = this.state;

    Alert.alert('Account', `${username}  ${password}`);
  }

  render() {
    return (
      <View style={styles.container}>

        <Image style={{width:100, height: 100}} source={require('../Images/Ilus.jpg')}/>

        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          label='Email'
          style={styles.input2}
          placeholder='Email'
        />

        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          label='Password'
          secureTextEntry={true}
          style={styles.input}
          placeholder='Password'
        />

        <Button
          title={'Login'}
          color={'#35dbc2'}
          onPress={this.onLogin.bind(this)}
        />

        <TouchableOpacity onPress={()=>{}}>
          <Text style={styles.signup}>Forgot password ? </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{}}>
          <Text style={styles.signup}>You don't have an account yet ? sign up !</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  signup: {
    textDecorationLine: 'underline',
    color: 'blue'
  },

  container: {
    flexDirection: 'column',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },

  input: {
    marginTop: 5,
    borderRadius: 20,
    width: 250,
    height: 44,
    padding: 10,
    textAlign: 'center',
    borderColor: '#35dbc2',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#e4f7f4'
  },
  input2: {
    marginTop: 30,
    borderRadius: 20,
    width: 250,
    height: 44,
    padding: 10,
    textAlign: 'center',
    borderColor: '#35dbc2',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#e4f7f4'
  },

  inputext: {
    borderRadius: 5,
    width: 250,
    height: 44,
    padding: 10,
    textAlign:'center',
    fontWeight:'bold',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    backgroundColor: 'white',
  },

})