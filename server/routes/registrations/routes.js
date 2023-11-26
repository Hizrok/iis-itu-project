const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { get_state, get_active_registration } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_registrations);
router.get(
  "/courses/:student",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.get_registered_courses
);
router.get(
  "/activities/:student",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.get_activities
);

router.post("/", authenticate(["admin"]), controller.add_registration);
router.post(
  "/course",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.register_course
);
router.post(
  "/activity",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.register_activity
);

router.put("/:id", authenticate(["admin"]), controller.set_status);
router.put(
  "/start/:id",
  [authenticate(["admin"]), get_state],
  controller.start
);
router.put("/stop/:id", [authenticate(["admin"]), get_state], controller.stop);
router.put("/reset/:id", authenticate(["admin"]), controller.reset);

router.delete("/:id", authenticate(["admin"]), controller.delete_registration);
router.delete(
  "/:type/:object_id/:student",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.unregister
);

module.exports = router;
