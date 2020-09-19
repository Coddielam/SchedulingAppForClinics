import axios from "axios";
// import uuid from "react-native-uuid";
import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = ({
  setNeedRegister,
  setToken,
  setIsAuthenticated,
  setUser,
  setMsg,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [errors, setErrors] = useState([]);

  const login = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let body = { email, password };
    body = JSON.stringify(body);
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/clinics/login",
          body,
          config
        );
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setMsg("Login Successful");
        setTimeout(() => {
          setMsg("");
        }, 2000);
      } catch (err) {
        setErrors(err.response.data.errors);
        setToken("");
        setUser({});
        setIsAuthenticated(false);
      }
    })();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.authForm}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <Text style={styles.title}>Login to Your Clinic Account</Text>
      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <Text key={index} style={styles.errorMsg}>
              {error.msg}
            </Text>
          );
        })}
      <Text style={styles.fieldTitle}>Email:</Text>
      <TextInput
        autoCapitalize={"none"}
        style={styles.mediumFont}
        placeholder="Please enter account email..."
        value={email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        onSubmitEditing={() => {
          passwordField.focus();
        }}
      />
      <Text style={styles.fieldTitle}>Password:</Text>
      <TextInput
        style={styles.mediumFont}
        secureTextEntry={true}
        placeholder="Please enter account password..."
        value={password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        ref={(input) => {
          passwordField = input;
        }}
      />
      <TouchableOpacity
        style={{ ...styles.button, marginLeft: 0 }}
        onPress={login}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.mediumFont}>Don't already have an account?</Text>
        <TouchableOpacity
          style={{ ...styles.button, marginLeft: 0, backgroundColor: "coral" }}
          onPress={() => {
            setNeedRegister(true);
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "dodgerblue",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 45,
    margin: 20,
  },

  authForm: {
    margin: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 30,
  },
  fieldTitle: {
    fontSize: 30,
  },
  mediumFont: {
    fontSize: 20,
    paddingVertical: 20,
  },
  errorMsg: {
    color: "red",
    marginVertical: 10,
  },
});

export default Login;
