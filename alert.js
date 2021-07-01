
const axios = require('axios');
const nodemailer = require('nodemailer');
const date = new Date();


// database Connection
const mongoose = require('mongoose').set('debug', true);
const dbUrl = 'Paste DB url here';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to database')

    })
    .catch(err => {
        console.log(err)
    })
const filterAndContact = require('./database/schema');


// Alert Class Template
class AlertRoutine {
    constructor(age) {
        this.age = age
        this.data = undefined
        this.smsClient = undefined
        this.alertMessege = {}
        console.log('Alert Created')
        setInterval(this.makeCowinRequest.bind(this), 3000);
    }
    sendAlert(contacts) {
        for (contact of contacts.contacts) {
            this.sendEmailAlert(contact, contacts._id)
        }
        console.log('sendingAlert');
        //this.sendSMS()
    }
    checkAvailibility(district_id) {
        let centers = this.data.centers;
        let found18 = false;
        let found45 = false;
        let contacts = undefined;
        for (let center of centers) {
            for (let sess of center.sessions) {
                if (sess.available_capacity > 0) {
                    this.alertMessege.date = sess.date
                    this.alertMessege.available_capacity = sess.available_capacity
                    this.alertMessege.vaccine = sess.vaccine
                    this.alertMessege.min_age_limit = sess.min_age_limit
                    this.alertMessege.centerName = center.name
                    this.alertMessege.centerAddress = center.address
                    for (let age of [18, 45]) {
                        filterAndContact.find({ district_id: district_id, Age: age })
                            .then(res => {
                                console.log(res)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                }
                if (found18 && found45) {
                    break
                }
            }
            if (found18 && found45) {
                break
            }
        }
    }

    makeCowinRequest() {
        let headers = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36", }
        let currentDate = `${date.getDate() + 1}-${date.getUTCMonth() + 1}-${date.getFullYear()}`;

        for (let district_id = 1; district_id <= 737; district_id++) {

            let sessionby7days = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${currentDate}`
            axios.get(sessionby7days, {
                headers,
            })
                .then(response => {
                    this.data = response.data;
                    this.checkAvailibility(district_id)
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }

    setupSMS() {
        const accountSid = 'ACa06bbca9d0a60e6bbefdd51c1f758e46';
        const authToken = '0eeeb2c797db33e2eab4c3e2a0406bfb';
        const client = require('twilio')(accountSid, authToken);
        this.smsClient = client
    }
    sendSMS() {
        let messege = ` 
        Slot Available :
        Date: ${this.alertMessege.date}
        Center: ${this.alertMessege.centerName}
        Address: ${this.alertMessege.centerAddress}
        Capacity:${this.alertMessege.available_capacity}
        Vaccine: ${this.alertMessege.vaccine}
        Age limit : ${this.alertMessege.min_age_limit}
        `
        this.smsClient.messages
            .create({
                body: messege,
                from: '12109085438',
                to: '919834178149'
            })
            .then(message => console.log(message.sid));
    }
    sendEmailAlert(contact, filter_id) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "cowinupdate2021@gmail.com",
                pass: "J097@sumit"
            }
        });
        let removeAlertLink = `http://localhost:3000/removeAlert/${filter_id}&${contact._id}`
        let message = `<h4>Slots Available</h4>
        <p>Showing only one center check out for more on <a href="https://selfregistration.cowin.gov.in/"> Cowin Portal</a> </p>
        <br>
        Slot Available :
        <h5>Date: ${this.alertMessege.date}</h5>
        <h5>Center: ${this.alertMessege.centerName}</h5>
        <h5>Address: ${this.alertMessege.centerAddress}</h5>
        <h5>Capacity:${this.alertMessege.available_capacity}</h5>
        <h5>Vaccine: ${this.alertMessege.vaccine}</h5>
        <h5>Age limit : ${this.alertMessege.min_age_limit}</h5>
        <h3> CLick on below button if you want to remove This Alert :</h3>
        <form action=${removeAlertLink}>
            <input type="submit" value="Go to Google" />
        </form>
        
        `;
        var mailOptions = {
            from: 'cowinupdate2021@gmail.com',
            to: 'sumitchoube4321@gmail.com',
            subject: 'Cowin Slot available',
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
let alert = new AlertRoutine(18)
alert.setupSMS()





