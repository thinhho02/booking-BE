import mongoose from "mongoose";
import Hotel from "./hotels.js";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  hotel:{
    type: Schema.Types.ObjectId,
    ref: "Hotel"
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.post("save", async function(doc){
  // console.log(doc)
  const findReviews = await Review.find({hotel: doc.hotel}).select("_id")
  
  // const updateReivewAtHotel = findReviews.map(review => review._id)
  console.log(findReviews)
  await Hotel.findByIdAndUpdate(doc.hotel,{
    reviews: findReviews.length ? findReviews.map(review => review._id) : []
  })
  const hotel = await Hotel.findById(doc.hotel)
  await hotel.updateRating()
})

const Review = mongoose.model("Review",reviewSchema)

export default Review
