const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_activities);

router.get("/:id", authenticate(["admin"]), controller.get_activity);

router.post("/", authenticate(["admin"]), controller.add_activity);

router.put("/:id", authenticate(["admin"]), controller.edit_activity);

router.delete("/:id", authenticate(["admin"]), controller.delete_activity);

module.exports = router;
