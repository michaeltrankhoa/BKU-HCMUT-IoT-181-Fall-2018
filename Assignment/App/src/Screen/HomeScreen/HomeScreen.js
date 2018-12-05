/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import SwitchCardComponent from "../../Components/SwitchCardComponent/SwitchCardComponent";
import { Card, Button } from "react-native-elements";
import Images from "../../Theme/Image";
import Config from "../../Services/Config";
import axios from "axios";
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    //this._turnOffAll = this._turnOffAll.bind(this);
    this._goToDetail = this._goToDetail.bind(this);

    //GET socket ID
    const { socketID } = this.props.navigation.state.params;

    this.state = {
      switchs: [
        { name: "SW1", state: false },
        { name: "SW2", state: false },
        { name: "SW3", state: false },
        { name: "SW4", state: false }
      ],
      socketID: socketID
    };
  }

  _getData = async () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let year = today.getFullYear();
    let url =
      "http://192.168.0.139:5533/sockets/" +
      this.state.socketID +
      "%" +
      dd +
      "%" +
      mm +
      "%" +
      year;

    let url_today =
      Config.urlServer +
      "/sockets/" +
      this.state.socketID +
      "%" +
      dd +
      "%" +
      mm +
      "%" +
      year;
    let url_month =
      Config.urlServer +
      "/sockets/" +
      this.state.socketID +
      "%" +
      0 +
      "%" +
      mm +
      "%" +
      year;
    //console.warn(url_month)
    try {
      //let data = axios.get("http://192.168.0.139:5533/sockets/1%1%12%2018");
      let today = await axios.get(url_today);
      let month = await axios.get(url_month);
      //console.warn(today.data);
      //console.warn(month.data);

      this.setState({
        loading: false
        //today: res
      });
    } catch (error) {
      alert("Error on Home: " + error);
    }
  };

  _toggleSocket() {
    let url = Config.urlServer + "/mqtts";
    axios.post(url).then(res => {
      alert("Socket toggle!");
    });
  }

  _goToDetail() {
    this.props.navigation.navigate("DetailScreen", {
      socketID: this.state.socketID
    });
  }
  componentDidMount() {
    this._getData();
  }
  render() {
    return (
      <View>
        <Card styles={styles.cardContainer}>
          <View style={styles.headContainter}>
            <Image source={Images.dashboard} style={styles.dashboardImg} />
            <View style={styles.textContainer}>
              <Text style={styles.text}> Socket ID: #{this.state.socketID}</Text>
              
            </View>
          </View>

          <Button
            textStyle={styles.text}
            title="Toggle Socket"
            onPress={this._toggleSocket}
          />
          <View style={{ marginTop: 20 }}>
            <Button
              textStyle={styles.text}
              title="Go to Detail"
              onPress={this._goToDetail}
            />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headContainter: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 15
  },

  dashboardImg: {
    width: 128,
    height: 128
  },
  textContainer: {
    justifyContent: "space-around",
    marginLeft: 25
  },
  text: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
