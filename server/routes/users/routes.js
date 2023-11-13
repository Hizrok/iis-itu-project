const { Router } = require("express");

const controller = require("./controller");

const router = Router();

router.get("/", controller.get_users);
router.get("/:login", controller.get_user_by_login);

router.post("/", controller.add_user);

router.put("/:login", controller.edit_user);

router.delete("/:login", controller.delete_user);

module.exports = router;
