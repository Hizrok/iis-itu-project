const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { get_state } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_registrations);
router.get(
  "/:id/courses/:student",
  [authenticate(["admin", "student"]), get_state],
  controller.get_registered_courses
);
router.get(
  "/:id/activities/:student",
  [authenticate(["admin", "student"]), get_state],
  controller.get_activities
);

router.post("/", authenticate(["admin"]), controller.add_registration);
router.post(
  "/:id/course",
  [authenticate(["admin", "student"]), get_state],
  controller.register_course
);
router.post(
  "/:id/activity",
  [authenticate(["admin", "student"]), get_state],
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
  "/:id/:type/:object_id/:student",
  [authenticate(["admin", "student"]), get_state],
  controller.unregister
);

module.exports = router;
