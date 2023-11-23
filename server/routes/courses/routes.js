const { Router } = require("express");
const { authenticate_token } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_courses);
router.get("/:id", controller.get_course_by_id);

router.post("/", authenticate_token, controller.add_course);

router.put("/:id", authenticate_token, controller.edit_course);

router.delete("/:id", authenticate_token, controller.delete_course);

module.exports = router;
