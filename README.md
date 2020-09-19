# SchedulingAppForClinics 

Scheduling App for clinic to view appointment/consultation schedule and create new consultation

---

This app is built with NodeJS & ExpressJS for the backend, and React Native Expo for the frontend.
## Backend: 


### Database server:


- This app uses a MySQL database server with two tables created: **clinics** and **consultations** <br>
(if you wish to clone the project, please change the configuration in /config/default.json in order for it to work) <br>
- **clinics** contain registered clinic account info <br>
- **consultation** contain each consultation appointment's details <br>
There are two major api endpoints: `/api/clinics` and `/api/consultations` <br>
The first one contains two extended endpoints: `/api/clinics/register` and `/api/clinics/login`. Both are public endpoint that allows user to login or register. <br>
The second one allows users to get a particular clinic's consultation appointment records. Both are private routes that will require a Json Web Token to authenticate. <br>
<br>
## Frontend: <br>
User will first land on the Login page, with the option to register for an account. <br>
When user successfully login/register, they will be greeted with a calendar; the dates marked with blue dots indicate there are appointments on those dates. <br>
Users can press on a particular day to look at the appointments on that date. <br>
If there were appointments on that particular date, each appointment will be displayed in a box containing some basic information about the appointment. <br>
Users can press on each box to reveal the appointment's details. <br>
If there isn't appointment on that date, users will see a message "No Appointment Scheduled For Today". <br>

At the top of the screen, there's a pressible bar that also displays a brief message when users either have successfully logged in, registered, or added an appointment. <br>
Users can press on the bar when it says "Add Appointment" to add an appointment. After submitting,  the appointment will be reflected on the agenda. <br>
<br>
---
# Author: <br>
## Eddie Lam
