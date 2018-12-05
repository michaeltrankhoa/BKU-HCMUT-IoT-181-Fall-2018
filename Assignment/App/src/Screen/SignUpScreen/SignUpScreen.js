import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Images from "../../Theme/Image";
import axios from "axios";
import styles from "./SignUpScreenStyles";
export default class LoginSreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  _onButtonPress = () => {
    if (this.state.password && this.state.email == "admin") {
      this.props.navigation.navigate("HomeScreen");
    } else {
      alert("Please try again!");
    }
  };

  _logIn(name, pass) {
    const user = {
      "_id": name,
      "pvkey": pass,
  }

    axios.post("http://192.168.0.139:5533/users/", user).then(res => {
      //console.warn(res);
    });
    //  axios.post("http://192.168.0.139:5533/users/", user).then(res => {
    //   console.warn(res);
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.logo} style={styles.logoContainer} />

        <Text style={styles.textContainer}>Smart Plug</Text>

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          onChangeText={email => this.setState({ email })}
          placeholder="Email or Mobile Numer"
        />

        <TextInput
          style={styles.input}
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          placeholder="Password"
          secureTextEntry
          onChangeText={password => this.setState({ password })}
        />
        {/*   <Button onPress={onButtonPress} title = 'Login' style={styles.loginButton} /> */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this._logIn(this.state.email, this.state.password)}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
