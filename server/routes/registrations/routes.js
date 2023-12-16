const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { get_state, get_active_registration } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_registrations);
router.get(
  "/active",
  get_active_registration,
  controller.get_active_registration
);
router.get(
  "/courses/:user_id",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.get_courses_with_reg_data
);

router.post("/", authenticate(["admin"]), controller.add_registration);
router.post(
  "/courses",
  [authenticate(["admin", "student"]), get_active_registration],
  controller.register_course
);

router.put(
  "/:id",
  [authenticate(["admin"]), get_active_registration],
  controller.set_status
);
router.put("/next/:id", authenticate(["admin"]), controller.next_phase);
router.put("/reset/:id", authenticate(["admin"]), controller.reset);

router.delete("/:id", authenticate(["admin"]), controller.delete_registration);
router.delete(
  "/courses/:course/:user_id",
  [authenticate(["admin"], ["student"]), get_active_registration],
  controller.unregister_course
);

module.exports = router;
