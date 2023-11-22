const { Router } = require("express");
const { authenticate_token } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate_token, controller.get_users);
router.get("/:login", authenticate_token, controller.get_user_by_login);

router.post("/", authenticate_token, controller.add_user);

router.put("/:login", authenticate_token, controller.edit_user);

router.delete("/:login", authenticate_token, controller.delete_user);

module.exports = router;
