import express from "express";

import { createNewRoom } from "../../controller/room/createNewRoom.js";
import { isBusiness, verifyToken } from "../../middleware/vertifyToken.js";
import { updateRoom } from "../../controller/room/updateRoom.js";
import { deleteRoom } from "../../controller/room/deteleRoom.js";
import { getRoom, getAllRooms } from "../../controller/room/getRoom.js";
import { upload } from "../../util/imageKit.js";

const roomRouter = express.Router({mergeParams: true});

// Create new Room in {id} Hotel
roomRouter.post("/new",upload.array("files", 10) ,verifyToken, isBusiness, createNewRoom);

// Update Room in {id} Hotel
roomRouter.put("/:roomId",verifyToken, isBusiness, updateRoom)

// Delete Room in {id} Hotel
roomRouter.delete("/:roomId", verifyToken, isBusiness, deleteRoom)

// Get All Room in {id} Hotel
roomRouter.get("/", getAllRooms)

// Get a Room in {id} Hotel
roomRouter.get("/:roomId",getRoom)

export default roomRouter;
