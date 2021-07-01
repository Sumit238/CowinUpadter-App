const express = require('express')
const axios = require('axios');
const nodemailer = require('nodemailer');
const TeleBot = require('telebot');
const bot = new TeleBot('1748449175:AAEKTJMipsZaK-j4YxjhU3Kb-61e8lK5yTk');

bot.on('text', (msg) => msg.reply.text(msg.text));
bot.start();
let message = `bot started`;
bot.sendMessage(-270970851, message)
const app = express()
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))
let date = new Date();
let currentDate = `${date.getDate()}-${date.getUTCMonth() + 1}-${date.getFullYear()}`;
console.log(currentDate)
let state_id = 21
let state = 'Maharashtra'
let district_id = 365
let districtApi = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
let centerIds = [573138, 24986, 637038, 24593, 561750]

let sessionby7days = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${currentDate}`
console.log(sessionby7days)
class AlertRoutine {
    constructor(age) {
        this.count = 0;
        this.age = age
        this.data = undefined
        this.smsClient = undefined
        this.alertMessege = {}
        console.log('Alert Created')
        setInterval(this.makeCowinRequest.bind(this), 30000);
    }
    sendAlert() {
        console.log('sendingAlert');
        this.sendEmailAlert()
        this.sendTeleGram()
    }
    checkAvailibility() {
        let centers = this.data.centers;
        let found = false;
        for (let center of centers) {
            if (centerIds.includes(center.center_id)) {
                for (let sess of center.sessions) {
                    if (sess.available_capacity > 0 && sess.min_age_limit == 18 && sess.available_capacity_dose1 > 0 && center.fee_type == "Free") {
                        console.log('available')
                        found = true
                        this.alertMessege.date = sess.date
                        this.alertMessege.available_capacity = sess.available_capacity_dose1
                        this.alertMessege.vaccine = sess.vaccine
                        this.alertMessege.min_age_limit = sess.min_age_limit
                        this.alertMessege.centerName = center.name
                        this.alertMessege.centerAddress = center.address
                        this.sendAlert()
                    }
                }
            }
        }
        if (!found) {

            console.log('not found', this.count)
            this.count += 1
        }
    }

    makeCowinRequest(requestType = sessionby7days) {
        let headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",



        }
        axios.get(requestType, {
            headers,
        })
            .then(response => {
                this.data = response.data;
                this.checkAvailibility()
            })
            .catch(error => {
                console.log(error);
            });
    }
    setupSMS() {
        const accountSid = 'ACa06bbca9d0a60e6bbefdd51c1f758e46';
        const authToken = '0eeeb2c797db33e2eab4c3e2a0406bfb';
        const client = require('twilio')(accountSid, authToken);
        this.smsClient = client
    }
    sendTeleGram() {
        let message = `
    <   Showing only one center check out for more on https://www.cowin.gov.in/home
        Slot Available
        Date: ${this.alertMessege.date}
        Center: ${this.alertMessege.centerName}
        Address: ${this.alertMessege.centerAddress}
        Capacity:${this.alertMessege.available_capacity}
        Vaccine: ${this.alertMessege.vaccine}
        Age limit : ${this.alertMessege.min_age_limit}
        https://selfregistration.cowin.gov.in/
        `;
        bot.sendMessage(-270970851, message)
    }
    sendEmailAlert() {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "cowinupdate2021@gmail.com",
                pass: "J097@sumit"
            }
        });
        let message = `<h4>Slots Available</h4>
    <p>Showing only one center check out for more on <a href="https://www.cowin.gov.in/home"></a> </p>
    <br>
        Slot Available :
        <h5>Date: ${this.alertMessege.date}</h5>
        <h5>Center: ${this.alertMessege.centerName}</h5>
        <h5>Address: ${this.alertMessege.centerAddress}</h5>
        <h5>Capacity:${this.alertMessege.available_capacity}</h5>
        <h5>Vaccine: ${this.alertMessege.vaccine}</h5>
        <h5>Age limit : ${this.alertMessege.min_age_limit}</h5>
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
alert.makeCowinRequest()


