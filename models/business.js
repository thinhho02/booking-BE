import mongoose from "mongoose";

const { Schema } = mongoose;
const businessSchema = new Schema(
  {
    isConfirm: {
      type: Boolean,
      default: false,
    },
    businessType: {
      type: String,
    },
    nameCompany: {
      type: String,
    },
    address: {
      type: String,
    },
    taxCode: {
      type: String,
    },
    businessLicense: {
      type: String,
    },
    personalInfomation: {
      name: {
        type: String,
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true
      },
      numberPhone: {
        type: String,
        required: true
      }
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    hotels: [{type: Schema.Types.ObjectId, ref:"Hotel"}]
  },
  { timestamps: true }
);


// businessSchema.post("findOneAndDelete", async function (data) {
//   if (data.hotels.length) {
//     await Review.deleteMany({ _id: { $in: data.reviews } });
//   }
//   if (data.rooms.length) {
//     await Room.deleteMany({ _id: { $in: data.rooms } });
//   }
//   const findHotel = await Hotel.find({ofBusiness: data.ofBusiness}).select("_id")
  
//   await Business.findByIdAndDelete(data.ofBusiness,{
//     hotels: findHotel.length ? findHotel.map(hotel => hotel._id) : []
//   })
// });

const Business = mongoose.model("Business", businessSchema);
export default Business;
