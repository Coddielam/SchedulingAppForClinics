import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList,
  SectionList,
} from "react-native";
import { Agenda } from "react-native-calendars";
import Login from "./components/Login";
import Register from "./components/Register";
import AddConsultationForm from "./components/AddConsultationForm";

// Convert consultation record data to format accepted for Agendar items
const convertToCalendarListItems = (consultationRecordsArray) => {
  let items = {};
  consultationRecordsArray.map((record) => {
    let datetime = record.datetime;
    datetime = new Date(datetime);
    datetime = datetime.toLocaleString("en-CA");
    let d = datetime.substring(0, 10);
    let t = datetime.substring(12, 16);
    t += datetime.slice(-3);
    d in items
      ? items[d].push({ ...record, time: t })
      : (items[d] = [{ ...record, time: t }]);
  });
  return items;
};

// Consultation details
const ConsultationDetails = ({ meeting }) => {
  return (
    <View>
      <Text style={styles.recordDetail}>Diagnosis: {meeting.diagnosis}</Text>
      <Text style={styles.recordDetail}>Medication: {meeting.medication}</Text>
      <Text style={styles.recordDetail}>
        Consultation Fee: {meeting.consultation_fee}
      </Text>
      {meeting.has_followup ? (
        <Text style={{ color: "#3F704D", marginVertical: 5 }}>
          Has Follow-Up
        </Text>
      ) : (
        <Text style={{ color: "#486060", marginVertical: 5 }}>
          No Follow-Up
        </Text>
      )}
      <Text style={{ color: "gray", fontSize: 15, marginVertical: 5 }}>
        (Press to hide details)
      </Text>
    </View>
  );
};

// Agenda renderItem component
const ConsultationMeeting = ({ meeting }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <TouchableOpacity
      style={styles.consul_Record}
      onPress={() => setShowDetails(!showDetails)}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        Appointment time: {meeting.time}
      </Text>
      <Text style={styles.recordDetail}>Doctor: {meeting.doctor_name}</Text>
      <Text style={styles.recordDetail}>Patient: {meeting.patient_name}</Text>
      {showDetails ? (
        <ConsultationDetails meeting={meeting} />
      ) : (
        <Text style={{ color: "gray", fontSize: 15 }}>
          (Press to show details)
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function App() {
  // switching between login and register
  let [needRegister, setNeedRegister] = useState(false);
  // items for Agenda
  let [items, setItems] = useState({});
  // token received from either login or register
  let [token, setToken] = useState("");
  // login/ reister should set isAuthenticated to true
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  // For displaying AddConsultationForm
  let [createConsultation, setCreateConsultation] = useState(false);
  // clinic id coming from useEffect...
  let [user, setUser] = useState({});

  // fetch consultation records associated with the clinic on mount
  useEffect(() => {
    const config = {
      headers: {
        "x-auth-token": token,
      },
    };
    isAuthenticated &&
      (async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/consultations",
            config
          );
          let items = convertToCalendarListItems(res.data);

          setItems(items);
        } catch (err) {
          console.error(err);
        }
      })();
  }, [isAuthenticated, createConsultation]);

  return !isAuthenticated ? (
    needRegister ? (
      <Register
        setNeedRegister={setNeedRegister}
        setToken={setToken}
        setUser={setUser}
        setIsAuthenticated={setIsAuthenticated}
      />
    ) : (
      <Login
        setNeedRegister={setNeedRegister}
        setToken={setToken}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
    )
  ) : !createConsultation ? (
    <>
      <TouchableOpacity
        style={styles.navbar}
        onPress={() => {
          setCreateConsultation(!createConsultation);
        }}
      >
        <Text
          style={{ ...styles.mediumFont, fontSize: 25, color: "whitesmoke" }}
        >
          Add Consultation
        </Text>
      </TouchableOpacity>
      <Agenda
        style={styles.calendarList}
        items={items}
        renderItem={(item) => {
          return <ConsultationMeeting meeting={item} />;
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.message}>
              <Text style={{ ...styles.mediumFont, color: "gray" }}>
                No Scheduled Appointment
              </Text>
            </View>
          );
        }}
      />
    </>
  ) : (
    <AddConsultationForm
      clin_id={user.id}
      setCreateConsultation={setCreateConsultation}
    />
  );
}

const styles = StyleSheet.create({
  navbar: {
    marginTop: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  menuBar: {
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: "gray",
  },
  button: {
    backgroundColor: "dodgerblue",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 45,
    margin: 20,
  },
  calendarList: {
    flex: 1,
    marginTop: 2,
  },
  consul_Record: {
    flex: 3,
    minHeight: 80,
    padding: 20,
    margin: 10,
    marginRight: 20,
    backgroundColor: "white",
    borderLeftColor: "#B0C4DE",
    borderLeftWidth: 15,
  },
  recordDetail: {
    marginVertical: 5,
  },
  message: {
    flex: 1,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
  },
  authForm: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-evenly",
    margin: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  fieldTitle: {
    fontSize: 30,
  },
  mediumFont: {
    fontSize: 20,
  },
});
