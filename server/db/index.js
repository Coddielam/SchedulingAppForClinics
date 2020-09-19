const mysql = require("mysql");
const config = require("config");

const pool = mysql.createPool({
  connectionLimit: 10,
  user: config.get("sql_user"),
  password: config.get("sql_password"),
  database: "mediconcen",
  host: "localhost",
  port: 3306,
});

// Create mediconcen database
const sql_createdb = "CREATE DATABASE IF NOT EXISTS mediconcen";
pool.query(sql_createdb, (err, result) => {
  if (err) throw err;
  console.log("'mediconcen' database created...");
});

// Create clinics table
const sql_createclinics =
  "CREATE TABLE IF NOT EXISTS clinics(" +
  "id INT AUTO_INCREMENT, " +
  "email VARCHAR(255) NOT NULL UNIQUE, " +
  "password VARCHAR(255) NOT NULL, " +
  "clinic_name VARCHAR(255) NOT NULL, " +
  "phone_num VARCHAR(15) NOT NULL, " +
  "address VARCHAR(255) NOT NULL, " +
  "PRIMARY KEY (id))";
pool.query(sql_createclinics, (err, result) => {
  if (err) throw err;
  console.log("'clinics' table created...");
});

// Create consultation table
const sql_createconsult =
  "CREATE TABLE IF NOT EXISTS consultations(" +
  "consult_id INT AUTO_INCREMENT, " +
  "clinic_id INT, " +
  "doctor_name VARCHAR(255), " +
  "patient_name VARCHAR(255), " +
  "diagnosis VARCHAR(255), " +
  "medication VARCHAR(255), " +
  "consultation_fee FLOAT(10), " +
  "datetime DATETIME, " +
  "has_followup BOOL DEFAULT FALSE, " +
  "PRIMARY KEY (consult_id), " +
  "FOREIGN KEY (clinic_id) REFERENCES clinics(id))";
pool.query(sql_createconsult, (err, result) => {
  if (err) throw err;
  console.log("'consultations' table created...");
});

// mediconcen db object
let mediconcendb = {};

// ******************************     Utils     ******************************
// Check email
mediconcendb.checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT COUNT(email) FROM clinics WHERE email='${email}'`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

// Get clinic user
mediconcendb.getUser = (email) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM clinics WHERE email=?";
    pool.query(sql, email, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// ******************************     END Utils     ******************************

// Create clinic account
mediconcendb.createClinicAcct = (info) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO clinics SET ?";
    pool.query(sql, info, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(resolve);
    });
  });
};

// Create consultation record
mediconcendb.createConsultation = (consultation_record) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO consultations SET ?";
    pool.query(sql, consultation_record, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Select all consultation records
mediconcendb.getAllConsultRecords = (email) => {
  return new Promise(async (resolve, reject) => {
    let clinic = await mediconcendb.getUser(email);
    clinic = clinic[0];

    const sql =
      "SELECT * FROM consultations WHERE clinic_id=? ORDER BY datetime ASC";
    pool.query(sql, clinic.id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// Select consultation records by id
mediconcendb.getConsultRecords = (clinic_id) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM consultations WHERE clinic_id = ?";
    pool.query(sql, clinic_id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = mediconcendb;
