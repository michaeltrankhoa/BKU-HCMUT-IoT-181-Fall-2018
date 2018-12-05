import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import Images from "../../Theme/Image";
import styles from "./DetailDayScreenStyles";
import Config from "../../Services/Config";
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
};

const data = {
  labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 66]
    }
  ]
};

export default class DetailDayScreen extends Component {
  constructor(props) {
    super(props);

    //GET socket ID
    const { socketID } = this.props.navigation.state.params;
    this.state = {
      socketID: socketID,
      loading: true,
      data: {
        labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
        datasets: [
          {
            data: [2, 4.5, 2.8, 8, 9.9, 4, 6.6]
          }
        ]
      }
    };
  }
  static navigationOptions = {
    title: "DAY"
  };

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
    try {
      //let data = axios.get("http://192.168.0.139:5533/sockets/1%1%12%2018");
      let res = await axios.get(url_today);
      //console.warn(res.data);
      // if (res.data[6].consumption == null) {
      //   res.data[6].consumption = 0;
      // }
      let datasets = [];
      if (res.data.length > 0) {
        res.data.forEach(item => {
          datasets.push(item.consumption);
        });
        this.setState({
          loading: false,
          data: {
            labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
            datasets: [
              {
                data: datasets
              }
            ]
          }
        });
      }
    } catch (error) {
      alert("Error: " + error);
      this.props.navigation.navigation("HomeScreen");
    }
  };

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <View style={styles.container}>
        <LineChart
          data={this.state.data}
          width={Dimensions.get("screen").width}
          height={(Dimensions.get("screen").height * 2) / 3}
          chartConfig={chartConfig}
        />
      </View>
    );
  }
}
