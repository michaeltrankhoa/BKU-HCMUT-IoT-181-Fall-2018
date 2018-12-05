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
import axios from "axios";
import Config from "../../Services/Config"
import styles from "./DetailMonthScreenStyles";

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 99]
    }
  ]
};

//Calculate total
const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

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
        labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43, 66]
          }
        ]
      }
    };
  }
  static navigationOptions = {
    title: "MONTH"
  };

  _getData = async () => {
    let today = new Date();
    //let dd = today.getDate();
    let dd = 0;
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
    //console.warn(url_month);
    //console.warn(url);
    try {
      let res = await axios.get(url_month);
      //let res = await axios.get(url);
      //console.warn(res.data);
      let records = res.data.records;
      let length = records.length;
      let labels = [];
      let datasets = [];

      if (length > 10) {
        for (let i = 0; i < length; i++) {
          let day = parseInt(records[i].date.substring(6, 8));
          let dayStr = "";
          if (day % 5 == 0) {
            dayStr = day;
          }
          labels.push(dayStr);
          datasets.push(records[i].consumption);
        }
      } else {
        for (let i = 0; i < length; i++) {
          let day = parseInt(records[i].date.substring(6, 8));
          datasets.push(records[i].consumption);
          labels.push(day);
        }
      }
      this.setState({
        loading: false,
        data: {
          labels: labels,
          datasets: [
            {
              data: datasets
            }
          ]
        }
      });
    } catch (error) {
      alert("Error: " + error);
      //this.props.navigation.navigation("HomeScreen");
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
