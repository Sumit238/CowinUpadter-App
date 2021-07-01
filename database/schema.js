const { strict } = require('assert');
const { text } = require('express');
const { MongoServerSelectionError } = require('mongodb');
const mongoose = require('mongoose');
const filtersSchema = new mongoose.Schema({
    state_id: {
        type: Number,
        required: true,
        min: 1
    },
    district_id: {
        type: Number,
        required: true,
        min: 1
    },
    Age: {
        type: Number,
        enum: [18, 45]
    },
    contacts: [
        {
            name: {
                type: String,
                required: true
            },
            pHno: {
                type: Number,
                length: 10,
            },
            email: {
                type: String,
                required: true,

            }
        }
    ]

})
const filters = mongoose.model('filters', filtersSchema);
module.exports = filters;