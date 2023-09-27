const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    riderEmail: {
        type: String,
    },
    driverEmail: {
        type: String, 
    },
    rangoId: {
        type: String,
        required: true,
        unique:true,
    },
    rideStart: {
        type: Boolean,
    },
    rideEnd: {
        type: Boolean,
    },
    sotp: {
        type: Number, 
        max: 9999,
        min:0,
    },
    eotp: { 
        type: Number,
        min: 0,
        max: 9999,
    },
    pickupLocation: { 
        type: Array,
        required: true,
    },
    destinationLocation: {
        type: Array,
        required: true,
    },
    driverCurrentLocation:{
        type:Array,
    },
    price:{
        type:Number,
    },
    distane:{
        type:Number,
    },
    Rating:{
        type:Number,
        max:5,
    },
    didCancel:{
        type:Boolean,
    }
});

module.exports = mongoose.model("RideTour", rideSchema);