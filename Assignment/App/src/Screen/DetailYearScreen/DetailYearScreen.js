import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Images from "../../Theme/Image";
import styles from "./DetailYearScreenStyles";
import axios from "axios";
import Config from "../../Services/Config";
//Calculate total
//const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
};

export default class DetailMonthScreen extends Component {
  constructor(props) {
    super(props);
    //GET socket ID
    const { socketID } = this.props.navigation.state.params;
    this.state = {
      socketID: socketID,

      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 66]
          }
        ]
      }
    };
  }
  static navigationOptions = {
    title: "YEAR"
  };

  _getData = async () => {
    let today = new Date();
    //let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let year = today.getFullYear();
    let url =
      "http://192.168.0.139:5533/sockets/" +
      this.state.socketID +
      "%" +
      0 +
      "%" +
      0 +
      "%" +
      year;

    let url_year =
      Config.urlServer +
      "/sockets/" +
      this.state.socketID +
      "%" +
      0 +
      "%" +
      0 +
      "%" +
      year;
    try {
      //let data = axios.get("http://192.168.0.139:5533/sockets/1%1%12%2018");
      let res = await axios.get(url_year);
      //console.warn(url);
      let records = res.data.records;
      let length = records.length;
      //let labels = [];
      let datasets = [];
      records.forEach(records => {
        datasets.push(records.totalConsumption);
      });
      this.setState({
        loading: false,
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              data: datasets
            }
          ]
        }
      });
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
