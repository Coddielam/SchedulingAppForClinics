import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Registration = ({
  setNeedRegister,
  setToken,
  setIsAuthenticated,
  setUser,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    clinic_name: "",
    phone_num: "",
    address: "",
  });
  const {
    email,
    password,
    confirm_password,
    clinic_name,
    phone_num,
    address,
  } = formData;

  const [errors, setErrors] = useState([]);

  const register = () => {
    if (password !== confirm_password) {
      return setErrors([{ msg: "Password confirmation did not match" }]);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body = {
      email,
      password,
      clinic_name,
      phone_num,
      address,
    };
    body = JSON.stringify(body);

    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/clinics/register",
          body,
          config
        );
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
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
      <ScrollView>
        <View style={{ height: 20 }} />
        <Text style={styles.title}>Register for A Clinic Account</Text>
        <Text style={styles.fieldTitle}>Email:</Text>
        <TextInput
          autoCapitalize={"none"}
          style={styles.mediumFont}
          keyboardType="email-address"
          placeholder="Please enter an email..."
          value={email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          onSubmitEditing={() => {
            passwordField.focus();
          }}
        />
        <Text style={styles.fieldTitle}>Password:</Text>
        <TextInput
          autoCapitalize={"none"}
          ref={(input) => {
            passwordField = input;
          }}
          style={styles.mediumFont}
          placeholder="Please enter a password..."
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          onSubmitEditing={() => {
            passwordConfirmField.focus();
          }}
        />
        <Text style={styles.fieldTitle}>Password Confirmation:</Text>
        <TextInput
          autoCapitalize={"none"}
          ref={(input) => {
            passwordConfirmField = input;
          }}
          style={styles.mediumFont}
          placeholder="Please re-enter a password..."
          value={confirm_password}
          secureTextEntry={true}
          onChangeText={(text) =>
            setFormData({ ...formData, confirm_password: text })
          }
          onSubmitEditing={() => {
            clinicNameField.focus();
          }}
        />
        <Text style={styles.fieldTitle}>Clinic Name:</Text>
        <TextInput
          ref={(input) => {
            clinicNameField = input;
          }}
          style={styles.mediumFont}
          placeholder="Please enter name of clinic..."
          value={clinic_name}
          onChangeText={(text) =>
            setFormData({ ...formData, clinic_name: text })
          }
          onSubmitEditing={() => {
            phoneField.focus();
          }}
        />
        <Text style={styles.fieldTitle}>Phone Number:</Text>
        <TextInput
          ref={(input) => (phoneField = input)}
          style={styles.mediumFont}
          placeholder="Please enter a phone number..."
          keyboardType="numeric"
          value={phone_num}
          onChangeText={(text) => setFormData({ ...formData, phone_num: text })}
          onSubmitEditing={() => {
            addressField.focus();
          }}
        />
        <Text style={styles.fieldTitle}>Address:</Text>
        <TextInput
          ref={(input) => (addressField = input)}
          style={styles.mediumFont}
          placeholder="Please enter your address..."
          value={address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
        <TouchableOpacity
          style={{ ...styles.button, marginLeft: 0 }}
          onPress={register}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
        </TouchableOpacity>
        {errors.length > 0 &&
          errors.map((error, index) => {
            return (
              <Text key={index} style={styles.errorMsg}>
                {error.msg}
              </Text>
            );
          })}
        <View>
          <Text style={styles.mediumFont}>Already have an account?</Text>
          <TouchableOpacity
            style={{
              ...styles.button,
              marginLeft: 0,
              backgroundColor: "coral",
            }}
            onPress={() => {
              setNeedRegister(false);
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
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
    flex: 1,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  fieldTitle: {
    fontSize: 30,
    marginVertical: 20,
  },
  mediumFont: {
    fontSize: 20,
    paddingVertical: 5,
  },
  errorMsg: {
    color: "red",
    marginVertical: 10,
  },
});

export default Registration;
