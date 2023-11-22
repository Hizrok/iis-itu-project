const { Router } = require("express");
const { authenticate_token } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_courses);
router.get("/:course_id", controller.get_course_by_id);

router.post("/", authenticate_token, controller.add_course);

module.exports = router;
