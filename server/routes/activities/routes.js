const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_activities);
router.get("/:id", authenticate(["admin"]), controller.get_activity);

router.post("/", authenticate(["admin"]), controller.add_activity);
router.post("/:id", authenticate(["admin"]), controller.add_lecturer);

router.put("/:id", authenticate(["admin"]), controller.edit_activity);

router.delete("/:id", authenticate(["admin"]), controller.delete_activity);
router.delete(
  "/:id/:lecturer",
  authenticate(["admin"]),
  controller.delete_lecturer
);

module.exports = router;
