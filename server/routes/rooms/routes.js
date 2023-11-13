const { Router } = require("express");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_rooms);
router.get("/:id", controller.get_room_by_id);

router.post("/", controller.add_room);

router.delete("/:id", controller.delete_room);

module.exports = router;
