import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddConsultationForm = ({ clin_id, setCreateConsultation }) => {
  const [formData, setFormData] = useState({
    clinic_id: clin_id,
    doctor_name: "",
    patient_name: "",
    diagnosis: "",
    medication: "",
    consultation_fee: "",
    // datetime:"",
    has_followup: false,
  });
  const {
    clinic_id,
    doctor_name,
    patient_name,
    diagnosis,
    medication,
    consultation_fee,
    // datetime,
    has_followup,
  } = formData;

  const [errors, setErrors] = useState([]);

  // for datetime picker
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const dateOnChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const createRecord = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      clinic_id,
      doctor_name,
      patient_name,
      diagnosis,
      medication,
      consultation_fee,
      datetime: date.toISOString().replace(/T/, " ").replace(/\..+/, ""), // YYYY-MM-DD hh:mm:ss
      has_followup,
    });

    (async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/consultations",
          body,
          config
        );
        //****************************** comes back with objec with msg key
        setCreateConsultation(false); // back to Agenda...
      } catch (err) {
        return setErrors(err.response.data.errors);
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
        <Text style={styles.title}>Create Consultaion:</Text>

        <Text style={styles.fieldTitle}>Patient Name:</Text>
        <TextInput
          style={styles.mediumFont}
          placeholder="Please enter patient's name..."
          value={patient_name}
          onChangeText={(text) =>
            setFormData({ ...formData, patient_name: text })
          }
        />
        <Text style={styles.fieldTitle}>Doctor's Name:</Text>
        <TextInput
          style={styles.mediumFont}
          placeholder="Please enter doctor's name..."
          value={doctor_name}
          onChangeText={(text) =>
            setFormData({ ...formData, doctor_name: text })
          }
        />
        <Text style={styles.fieldTitle}>Diagnosis:</Text>
        <TextInput
          style={styles.mediumFont}
          placeholder="Please enter diagnosis..."
          value={diagnosis}
          onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
        />
        <Text style={styles.fieldTitle}>Prescribtion:</Text>
        <TextInput
          style={styles.mediumFont}
          placeholder="Please enter prescribed medication..."
          value={medication}
          onChangeText={(text) =>
            setFormData({ ...formData, medication: text })
          }
        />
        <Text style={styles.fieldTitle}>Consultation Fee:</Text>
        <TextInput
          style={styles.mediumFont}
          keyboardType="numeric"
          placeholder="Please enter consultation fee..."
          value={consultation_fee}
          onChangeText={(text) =>
            setFormData({ ...formData, consultation_fee: text })
          }
        />
        <Text style={styles.fieldTitle}>Date And Time:</Text>

        <Text
          style={{
            fontSize: 30,
            color: "#5F9EA0",
            fontWeight: "bold",
            marginBottom: 15,
          }}
        >
          {date.toString().substring(4, 21)}
        </Text>
        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: "center",
          }}
          onPress={() => {
            setShow(true);
            setMode("date");
          }}
        >
          <Text style={{ ...styles.mediumFont, color: "dodgerblue" }}>
            Select Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: "center",
          }}
          onPress={() => {
            setShow(true);
            setMode("time");
          }}
        >
          <Text style={{ ...styles.mediumFont, color: "dodgerblue" }}>
            Select Time
          </Text>
        </TouchableOpacity>

        {show && (
          <>
            <DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={dateOnChange}
            />
            <Button
              title="Submit"
              onPress={() => {
                setShow(false);
              }}
            />
          </>
        )}

        <Text style={styles.fieldTitle}>Has Follow-up?</Text>

        <TouchableOpacity
          style={styles.checkBox}
          onPress={() =>
            setFormData({ ...formData, has_followup: !has_followup })
          }
        >
          <Text
            style={{
              fontSize: 30,
              textAlignVertical: "center",
              marginTop: -8,
            }}
          >
            {has_followup ? "x" : ""}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, marginLeft: 0 }}
          onPress={createRecord}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Create Record</Text>
        </TouchableOpacity>
        {errors.length > 0 &&
          errors.map((error, index) => {
            return (
              <Text key={index} style={styles.errorMsg}>
                {error.msg}
              </Text>
            );
          })}

        <TouchableOpacity
          style={{
            ...styles.button,
            marginLeft: 0,
            backgroundColor: "gray",
          }}
          onPress={() => {
            setCreateConsultation(false);
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Cancel</Text>
        </TouchableOpacity>
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
    width: 200,
    height: 45,
    margin: 20,
  },
  checkBox: {
    flex: 1,
    width: 25,
    height: 25,
    fontWeight: "bold",
    borderColor: "gray",
    borderWidth: 1,
    paddingTop: -10,
    alignItems: "center",
    justifyContent: "center",
  },

  authForm: {
    flex: 1,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 50,
    paddingBottom: 80,
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

export default AddConsultationForm;
