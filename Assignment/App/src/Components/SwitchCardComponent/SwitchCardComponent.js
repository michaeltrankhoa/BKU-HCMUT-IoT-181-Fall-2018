import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card, ListItem, Button } from "react-native-elements";
import Images from "../../Theme/Image";
import SwitchToggle from "react-native-switch-toggle";
export default class CardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchOn: this.props.switchState,
      switchName: this.props.switchName
    };
  }
  onPress = () => {
    this.setState({ switchOn: !this.state.switchOn });
  };
  render() {
    return (
      <Card>
        <View style={styles.header}>
          <Image style={styles.headerIcon} source={Images.energy} />
          <Text>Socket name: {this.state.switchName}</Text>
          <SwitchToggle switchOn={this.state.switchOn} onPress={this.onPress} />
        </View>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerIcon: {
    width: 48,
    height: 48
  }
});
