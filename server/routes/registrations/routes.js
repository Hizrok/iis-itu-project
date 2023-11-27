const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { get_state, get_active_registration } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_registrations);
// get registered courses of an user
router.get(
  "/courses/:user_id",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.get_registered_courses
);
// get courses of an user with reg data
router.get(
  "/courses/:user_id/reg_data",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.get_courses_with_reg_data
);
// get registered instances of an user
router.get(
  "/instances/:user_id",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.get_registered_instances
);
// get instances of an user with reg data
router.get(
  "/instances/:user_id/reg_data",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.get_instances_with_reg_data
);
router.get(
  "/activities/:student",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.get_activities
);
router.get(
  "/active",
  get_active_registration,
  controller.get_active_registration
);

router.post("/", authenticate(["admin"]), controller.add_registration);
// register course for a student
router.post(
  "/courses",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.register_course
);
// register instance for a student
router.post(
  "/instances",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.register_instance
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
// unregister course or instance for a student
router.delete(
  "/:type/:object_id/:student",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.unregister
);

module.exports = router;
