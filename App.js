// import React, { Component } from 'react';
// import { Alert, AppRegistry, Button, StyleSheet, View, Text, TextInput } from 'react-native';
// import axios from "axios";
//
// export default class SignIn extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {username: '', password: '', firstName: '', lastName: ''};
//
//   }
//   _postUser = () => {
//     console.log(this.state.firstName)
//     var self = this;
//     console.log(self.state.firstName)
//     console.log(self.state.lastName)
//     const getUsersData = {
//       todo: "register",
//       type: "user",
//       firstName: self.state.firstName,
//       lastName: self.state.lastName,
//       password: self.state.password,
//       username: self.state.username
//     }
//     console.log(getUsersData)
//     const querystring = require('querystring');
//     axios.post ("http://169.234.64.64:8000/hourglass_db/", querystring.stringify(getUsersData))
//   }
//
//   render() {
//     return (
//       <View style={styles.container}>
//
//         <TextInput
// 		  style = {{fontSize: 30, margin: 30, marginTop: 20 }}
//           placeholder="Enter your first name"
//           onChangeText={(firstName) => this.setState({firstName})} value = {this.state.firstName}
//         />
//
//         <TextInput
//
// 		  style = {{fontSize: 30, margin: 30 }}
//           placeholder="Enter your last name"
//           onChangeText={(lastName) => this.setState({lastName})} value = {this.state.lastName}
//         />
//
//         <TextInput
// 		  style = {{fontSize: 30, margin: 30 }}
//           placeholder="Enter your username"
//           onChangeText={(username) => this.setState({username})} value = {this.state.username}
//         />
//
//         <TextInput
// 		  style = {{fontSize: 30, margin: 30, marginBottom: 50 }}
//           placeholder="Enter your password"
//           onChangeText={(password) => this.setState({password})} value = {this.state.password}
//         />
//
//         <Button
//   		  onPress={() => {
//       	  this._postUser()
//           }}
//           title="Create Account"
//         />
//
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingTop: 100,
//     alignItems: 'center'
//     }
//     });
//
//
//
// AppRegistry.registerComponent('Hourglass', () => SignIn);

// import App from "./app/index";
// export default App;

import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { AsyncStorage } from "react-native";
import SignUpScreen from "./app/Screens/SignUpScreen"
import SignInScreen from "./app/Screens/SignInScreen"
import ChatbookScreen from "./app/Screens/ChatbookScreen"
import axios from "axios"
import ChatroomScreen from "./app/Screens/ChatroomScreen"
import Settings from "./app/Screens/Settings"

const LoginStack = createStackNavigator(
  {
    SignInScreen: {
      screen: SignInScreen
    },
    SignUpScreen: {
      screen: SignUpScreen
    }
  },
  {
    initialRouteName: "SignUpScreen",
    headerMode: "null"
  }
);

const UserStack = createStackNavigator(
  {
    ChatbookScreen: {
      screen: ChatbookScreen
    },
    ChatroomScreen: {
      screen: ChatroomScreen
    }
  }
)

const SettingsStack = createStackNavigator(
  {
    SettingsScreen: {
      screen: Settings
    }
  }
)

const AuthStack = createStackNavigator(
  { SignIn: LoginStack },
  { headerMode: "null" }
);

const AppStack = createBottomTabNavigator(
  {
    Chatroom: {
      screen: UserStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "CHAT",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-contact" color={tintColor} size={24} />
        ),
        tabBarOnPress: () => {
          var self = this
          const getUsersData = {
              todo: 'getAllUsers',
              type: 'user'
          }
          const querystring = require('querystring');
          axios.post('http://169.234.64.64:8000/hourglass_db/', querystring.stringify(getUsersData))
              .then(function(allUsersValues) {
                navigation.navigate("ChatbookScreen", {allUsers: allUsersValues['data']})

              })
        }
      })
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "SETTINGS",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-contact" color={tintColor} size={24} />
        ),
        tabBarOnPress: async () => {
          currentFirstName = await AsyncStorage.getItem("FirstName")
          currentLastName = await AsyncStorage.getItem("LastName")
          currentUsername = await AsyncStorage.getItem("Username")
          console.log(currentFirstName)
          navigation.setParams({firstName: currentFirstName, lastName: currentLastName, userName: currentUsername});
          navigation.navigate("Settings")
        }
      })
    }
})

export const createRootNavigator = () => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: AppStack
      },
      SignedOut: {
        screen: AuthStack
      }
    },
    {
      initialRouteName: "SignedOut"
    }
  );
};
// const createRootNavigator = (signedIn = false) => {
//   return createSwitchNavigator(
//     {
//       SignedOut: {
//         screen: AuthStack
//       },
//     },
//     {
//       initialRouteName: "SignedOut"
//     }
//   );
// };

export default createAppContainer(createSwitchNavigator(
  {
    SignedIn: {
      screen: AppStack
    },
    SignedOut: {
      screen: AuthStack
    }
  },
  {
    initialRouteName: "SignedOut"
  }
));

//export default AppContainer
// export const createRootNavigator = (signedIn = false) => {
//   return createSwitchNavigator(
//     {
//       SignedIn: {
//         screen: AppStack
//       },
//       SignedOut: {
//         screen: AuthStack
//       }
//     },
//     {
//       initialRouteName: signedIn ? "SignedIn" : "SignedOut"
//     }
//   );
// };
