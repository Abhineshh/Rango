const RideTour = require("../models/ridetourModel");
const otpGenetator = require("otp-generator");

module.exports.Chooser = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log('ding ding');
        const pickup = req.body.pickup;
        const destination = req.body.Destination;
        const rideremail = req.body.riderEmail;
        const riderid = req.body.rideid;
        console.log(pickup, " ", destination, " ", rideremail, " ", riderid)

        const startotp = otpGenetator.generate(4, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const endotp = otpGenetator.generate(4, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log(startotp, " ", endotp)

        const tour = await RideTour.create({
            riderEmail: rideremail,
            driverEmail: "nil",
            rangoId: riderid,
            rideStart: false,
            rideEnd: false,
            sotp: startotp,
            eotp: endotp,
            pickupLocation: pickup,
            destinationLocation: destination,
            price:0,
            distance:0,
            Rating:0,
            driverCurrentLocation:[77.645,13.434]
        });

        res.json({ status: true, tour })

    } catch (err) {

        res.json({ status: false });
        console.log(err)
        next(err);
    }
}

module.exports.RiderWait = async (req, res, next) => {
    try {
        console.log(req.query)
        const data = req.query.rideid;
        console.log("the loading Screen", req.query.rideid)
        const selected = await RideTour.where("rangoId").equals(data).findOne({ driverEmail: { $ne: 'nil' } })
        console.log('zing', selected)
        if (!selected) {
            res.json({ status: false });
            console.log('dingding')
        }
        if (selected) {
            const d = await RideTour.findOne({ driverEmail: { $eq: 'nil' } })
            if (d) {
                res.json({ status: true, selected })
            }
            if (!d) {
                res.json({ status: false })
            }
        }
    } catch (err) {
        console.log(err)
        next(err);
    }
}

module.exports.RiderDetails = async (req, res, next) => {
    try {
        const randoid = req.query.rideid;
        console.log('got the passenger details', randoid)
        const datas = await RideTour.findOne({ rangoId: { $eq: randoid } })

        if (datas) {
            res.json({ status: true, datas });
        }
        if (!datas) {
            res.json({ status: false, datas });
        }

    } catch (err) {
        console.log('RiderDetailsRouter: ', err)
    }
}

module.exports.TrackDriver = async (req, res, next) => {
    try {
        console.log(req.query);
        const data = req.query.rideid;
        const location = await RideTour.where("rangoId").equals(data).findOne({ driverCurrentLocation })
        console.log('zing', location)
        if (!location) {
            res.json({ status: false });
            console.log('dingding')
        }
        if (location) {
            res.json({ status: true, location });
        }
    } catch (err) {
        console.log('TrackDriverRouter: ', err)
    }
}

module.exports.EndRideOTP = async (req, res, next) => {
    try {
        console.log(req.body)
        const randoid = req.body.rangoid;
        const otp = req.body.stotp;
        const started = await RideTour.findOne({ rangoId: { $eq: randoid } }).where('eotp').equals(otp);
        console.log(started)
        if (started) {
            await RideTour.updateOne({ rangoId: { $eq: randoid } }, { $set: { rideEnd: true } });
            res.json({ status: true, started })
        }
        if (!started) {
            res.json({ status: false, started })
        }
    } catch (err) {
        console.log('StartRideOTPRouter: ', err)
    }
}

module.exports.AvailableRides = async (req, res, next) => {
    try {
        const Available = await RideTour.find({ rideStart: { $ne: true } }).where('driverEmail').equals('nil');
        if (Available) {

            res.json({ status: true, Available })
            console.log('kling')
        }
        if (!Available) {
            res.json({ status: false });
            console.log('dunk')
        }

        console.log('ding ding');
    } catch (err) {
        res.json({ status: false })
        next(err)
    }
}

module.exports.DriverChoose = async (req, res, next) => {
    try {
        console.log(req.body)
        const randoId = req.body.rangoid;
        const drivermaily = req.body.driveremail
        console.log(randoId, drivermaily)

        const Rideset = await RideTour.updateOne({ rangoId: { $eq: randoId } }, { $set: { driverEmail: drivermaily } });

        console.log(Rideset)
        if (Rideset.modifiedCount == 1 || Rideset.matchedCount == 1) {

            res.json({ status: true });
        }
        if (Rideset.modifiedCount == 0) {
            res.json({ status: false });
        }
    } catch (err) {
        console.log('DriverChoosenRouter: ', err)
        next(err)
    }
}

module.exports.DriverDetails = async (req, res, next) => {
    try {
        const randoid = req.query.rideid;
        console.log('ddd', randoid)
        const datas = await RideTour.findOne({ rangoId: { $eq: randoid } })

        if (datas) {
            res.json({ status: true, datas });
        }
        if (!datas) {
            res.json({ status: false, datas });
        }

    } catch (err) {
        console.log('RiderDetailsRouter: ', err)
    }
}

module.exports.DriverLiveLocation = async (req, res, next) => {
    try {
        console.log(req.body);
        const randoId = req.body.RangoRideId;
        const loc = req.body.CurrentLocation
        //const Rideset = await RideTour.updateOne({ rangoId: { $eq: randoId } }, { $set: { driverEmail: drivermaily } });
        const update = await RideTour.updateOne({ rangoId: { $eq: randoId } }, { $set: { driverCurrentLocation: loc } });
        console.log('ding ding');
         if (update.modifiedCount == 1 || update.matchedCount == 1) {

            res.json({ status: true });
        }
        if (update.modifiedCount == 0) {
            res.json({ status: false });
        }
    } catch (err) {
        console.log('DriverLiveLocationRouter: ', err)
    }
}

module.exports.StartRideOTP = async (req, res, next) => {
    try {
        console.log(req.body)
        const randoid = req.body.rangoid;
        const otp = req.body.stotp;
        const started = await RideTour.findOne({ rangoId: { $eq: randoid } }).where('sotp').equals(otp);
        console.log(started)
        if (started) {
            await RideTour.updateOne({ rangoId: { $eq: randoid } }, { $set: { rideStart: true } });
            res.json({ status: true, started })
        }
        if (!started) {
            res.json({ status: false, started })
        }
    } catch (err) {
        console.log('StartRideOTPRouter: ', err)
    }
}
