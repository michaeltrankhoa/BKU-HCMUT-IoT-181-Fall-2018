import {
  createStackNavigator,
  createTabNavigator,
  createBottomTabNavigator
} from "react-navigation";
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import LoginScreen from "../Screen/LoginScreen/LoginScreen";
import SignUpScreen from "../Screen/SignUpScreen/SignUpScreen";
import DetailScreen from "../Screen/DetailSreen/DetailSreen";
import DetailDayScreen from "../Screen/DetailDayScreen/DetailDayScreen"
import DetailMonthScreen from "../Screen/DetailMonthScreen/DetailMonthScreen";
import DetailYearScreen from "../Screen/DetailYearScreen/DetailYearScreen";

const DetailTab = createBottomTabNavigator({
  DetailDayScreen: {
    screen: DetailDayScreen
  },
  DetailMonthScreen: {
    screen: DetailMonthScreen
  },
  DetailYearScreen: {
    screen: DetailYearScreen
  }
});

const MainStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen
    },
    LoginScreen: {
      screen: LoginScreen
    },
    SignUpScreen: {
      screen: SignUpScreen
    },
    DetailScreen: DetailTab
  },
  {
    initialRouteName: "LoginScreen",
    headerMode: "none"
  }
);

export default MainStack;
