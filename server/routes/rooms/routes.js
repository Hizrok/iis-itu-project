const { Router } = require("express");
const { authenticate_token } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_rooms);
router.get("/:id", controller.get_room_by_id);

router.post("/", authenticate_token, controller.add_room);

router.put("/:id", authenticate_token, controller.edit_room);

router.delete("/:id", authenticate_token, controller.delete_room);

module.exports = router;
