import express from "express";
import { createNewReview } from "../../controller/review/createNewReview.js";
import { verifyToken } from "../../middleware/vertifyToken.js";
import { updateReview } from "../../controller/review/updateReview.js";
import { deleteReview } from "../../controller/review/deleteReview.js";
import { getReview } from "../../controller/review/getReview.js";

const reviewRouter = express.Router({ mergeParams: true });
// Create new Review in {id} Hotel
reviewRouter.post("/new", verifyToken, createNewReview);

// Update Review in {id} Hotel
reviewRouter.put("/:reviewId", verifyToken, updateReview);

// Delete Review in {id} Hotel
reviewRouter.delete("/:reviewId", verifyToken, deleteReview);

// Get all Review in {id} Hotel
reviewRouter.get("/", getReview);

export default reviewRouter;
