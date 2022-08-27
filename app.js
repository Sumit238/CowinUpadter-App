const express = require('express')
const methodOverride = require('method-override')
const metaData = require('./metaData')
const path = require('path');
const app = express()
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use('/static', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// database connection 
const mongoose = require('mongoose').set('debug', true);
<<<<<<< HEAD
const dbUrl = 'mongodb://localhost:27017/';
=======
const dbUrl = 'mongodb://127.0.0.1:27017/alerts';
>>>>>>> e64ce39ce66a63468f9978c0c20cc04b486bfc3b
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to database')

    })
    .catch(err => {
        console.log(err)
    })
const filterAndContact = require('./database/schema');


// api paths
app.get('/', (req, res) => {
    res.render('front.ejs', { states: metaData.States })
})
app.post('/addAlert', async (req, res) => {

    let alertSucess = false
    let filter = {
        state_id: req.body.state,
        district_id: req.body.district,
        Age: req.body.age,
        vaccine:req.body.vaccine
    }
    let details = {
        name: req.body.userName,
        pHno: req.body.pHno,
        email: req.body.email,
        active:false,
        alertAge:1
    }
    const isfilterExist =await filterAndContact.findOne(filter);
    if(!isfilterExist){
        const newFilter = new filterAndContact(filter);
        newFilter.contacts.push(details);
        await newFilter.save();
        
    }
    else{
        isfilterExist.contacts.push(details);
        await isfilterExist.save();
    }
    res.render('alertAddSucess.ejs');
})
app.get('/removeAlert/:id', async (req, res) => {
    let id = req.params.id
    let i = id.indexOf('&')
    let filter_id = id.slice(0, i)
    let contacts_id = id.slice(i + 1, id.length)
    let alertRemove = false
    console.log(filter_id, contacts_id)
    await filterAndContact.updateMany({ _id: filter_id }, {
        $pull: {
            contacts: { _id: contacts_id }
        }
    }).then(res => {
        console.log(res)
        alertRemove = true

    })
        .catch(err => {
            console.log(err)
            alertRemove = false

        })
    if (alertRemove) {
        res.render('alertRemoved.ejs')
    }
    else {
        res.render('alertRemoveFailed.ejs', { _id: id })
    }

})
