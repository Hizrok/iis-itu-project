const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin", "garant", "rozvrhář"]), controller.get_activities);
router.get("/:id", authenticate(["admin", "garant", "rozvrhář"]), controller.get_activity);

router.post("/", authenticate(["admin", "garant"]), controller.add_activity);
router.post("/:id", authenticate(["admin", "garant"]), controller.add_lecturer);

router.put("/:id", authenticate(["admin", "garant"]), controller.edit_activity);

router.delete("/:id", authenticate(["admin", "garant"]), controller.delete_activity);
router.delete(
  "/:id/:lecturer",
  authenticate(["admin", "garant"]),
  controller.delete_lecturer
);

module.exports = router;
