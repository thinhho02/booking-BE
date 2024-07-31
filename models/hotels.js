import mongoose from "mongoose";
import Review from "./reviews.js";
import Room from "./rooms.js";
import Business from "./business.js";

const { Schema } = mongoose;
const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numRooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    ranking: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    image: String,
    imageList: [String],
    amenities: [String],

    ofBusiness: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  },
  { timestamps: true }
);

hotelSchema.methods.updateRating = async function () {
  const ratings = await Review.find({ hotel: this._id }).select("rating");
  const totalRating = ratings.reduce((prev, review) => prev + review.rating, 0);
  this.ratingCount = ratings.length;
  this.rating = ratings.length ? (totalRating / ratings.length).toFixed(1) : 0;
  await this.save();
};


hotelSchema.pre("findOneAndUpdate", function (next) {
  if (this._update?.rooms) {
    this._update.numRooms = this._update.rooms.length;
  }
  next();
});


hotelSchema.post("save", async function (data) {
  
  
  const findHotel = await Hotel.find({ofBusiness: data.ofBusiness}).select("_id")

  await Business.findByIdAndUpdate(data.ofBusiness,{
    hotels: findHotel.length ? findHotel.map(hotel => hotel._id) : []
  })
});

hotelSchema.post("findOneAndDelete", async function (data) {
  if (data.reviews.length) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
  if (data.rooms.length) {
    await Room.deleteMany({ _id: { $in: data.rooms } });
  }
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
