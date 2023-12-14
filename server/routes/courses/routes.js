const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_courses);
router.get("/:id", controller.get_course);
// get all instances of all courses
// router.get("/instances", controller.get_all_instances);
// router.get("/:course/activities", controller.get_activities);
// router.get("/:course/activities/:id", controller.get_activity);
// router.get("/:course/activities/:id/lecturers", controller.get_lecturers);
// router.get("/:course/activities/:activity/instances", controller.get_instances);
// router.get(
//   "/:course/activities/:activity/instances/:id",
//   controller.get_instance
// );

router.post("/", authenticate(["admin"]), controller.add_course);
// router.post(
//   "/:course",
//   authenticate(["admin", "garant"]),
//   controller.add_activity
// );
// router.post(
//   "/:course/activities/:id/lecturers/",
//   authenticate(["admin", "garant"]),
//   controller.add_lecturer
// );
// router.post(
//   "/:course/activities/:id/instances/",
//   authenticate(["admin"]),
//   controller.add_instance
// );

router.put("/:id", authenticate(["admin", "garant"]), controller.edit_course);
// router.put(
//   "/:course/activities/:id",
//   authenticate(["admin", "garant"]),
//   controller.edit_activity
// );
// router.put(
//   "/:course/activities/:activity/instances/:id",
//   authenticate(["admin", "rozvrhář"]),
//   controller.edit_instance
// );

router.delete("/:id", authenticate(["admin"]), controller.delete_course);
// router.delete(
//   "/:course/activities/:id",
//   authenticate(["admin", "garant"]),
//   controller.delete_activity
// );
// router.delete(
//   "/:course/activities/:id/lecturers/:lecturer",
//   authenticate(["admin", "garant"]),
//   controller.delete_lecturer
// );
// router.delete(
//   "/:course/activities/:activity/instances/:id",
//   authenticate(["admin", "garant"]),
//   controller.delete_instance
// );

module.exports = router;
