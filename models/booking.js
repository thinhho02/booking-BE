import mongoose from "mongoose";
import Room from "./rooms.js";

const { Schema } = mongoose;
const bookSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    checkIn: String,
    checkOut: String,
    sumPeople: Number,
    price: Number,
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    status: String,
  },
  { timestamps: true }
);

bookSchema.post("save", async function (data) {
  try {
    await Room.findByIdAndUpdate(data.room, {
      isAvailable: false,
      checkInTime: data.checkIn,
      checkOutTime: data.checkOut,
    });
  } catch (error) {}
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
