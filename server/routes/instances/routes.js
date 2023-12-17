const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get(
  "/",
  authenticate(["admin", "garant", "vyučující", "rozvrhář"]),
  controller.get_instances
);

router.post("/", authenticate(["admin", "rozvrhář"]), controller.add_instance);

router.put(
  "/:id",
  authenticate(["admin", "rozvrhář"]),
  controller.edit_instance
);

router.delete(
  "/:id",
  authenticate(["admin", "rozvrhář"]),
  controller.delete_instance
);

module.exports = router;
