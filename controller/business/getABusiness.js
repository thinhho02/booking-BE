import Business from "../../models/business.js";
import Hotel from "../../models/hotels.js";

export const getABusiness = async (req, res) => {
  if (req.user) {
    try {
      const findBusiness = await Business.findOne({ user: req.user.id })
        .select("hotels")
        .populate({
          path: "hotels",
          select: "-createdAt -updatedAt",
          populate: [
            { path: "rooms", select: "-createAt -updateAt" },
            { path: "reviews", select: "-createAt -updateAt" },
          ],
          //   populate: { path: "reviews", select: "-createAt -updateAt" },
        })
        .exec();

      return res.status(200).json(findBusiness);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
