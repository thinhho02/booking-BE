import mongoose from "mongoose";

const { Schema } = mongoose;
const roomSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    title:{
      type: String,
      required: true
    },
    roomNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Suite", "Deluxe", "Family", "Twin"],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    services:[String],
    amenities: [String],
    photos: [String],
    bedType: {
      type: String,
      enum: ["Single", "Double", "Queen", "King", "Twin"],
    },
    maxOccupancy: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    isSmokingAllowed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const Room = mongoose.model("Room", roomSchema);

export default Room;
