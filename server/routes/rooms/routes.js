const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_rooms);
router.get("/:id", controller.get_room);

router.post("/", authenticate(["admin"]), controller.add_room);

router.put("/:id", authenticate(["admin"]), controller.edit_room);

router.delete("/:id", authenticate(["admin"]), controller.delete_room);

module.exports = router;
