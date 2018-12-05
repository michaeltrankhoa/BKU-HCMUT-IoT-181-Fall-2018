import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Images from "../../Theme/Image";
import styles from "./DetailSreenStyles";
export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    title: 'Details',
  };
  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.totalEnergy} style={styles.logoContainer} />

        <Text style={styles.primaryTextContainer}>525 kWh</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.secondTextContainer}>Estimate cost: </Text>
          <Text style={styles.secondTextContainer}>500,000 VND</Text>
        </View>
      </View>
    );
  }
}
