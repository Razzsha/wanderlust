const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

// Connect to MongoDB
main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase');
}

const initDB = async () => {
    await Listing.deleteMany({});

    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: '68ed035e62b6317d705c2ccb'
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("Database was initialized.");
};

initDB();
