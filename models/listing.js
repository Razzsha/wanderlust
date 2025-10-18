const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: 'https://via.placeholder.com/300x200.png?text=No+Image',
            set: (v) => v === '' ? 'https://via.placeholder.com/300x200.png?text=No+Image' : v
        }

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
