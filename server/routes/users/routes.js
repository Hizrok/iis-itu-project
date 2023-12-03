const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { generate_id, check_password } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_users);

router.get(
  "/:user_id",
  authenticate(["admin"], ["garant", "rozvrhář", "vyučující", "student"]),
  controller.get_user
);

router.post("/", [authenticate(["admin"]), generate_id], controller.add_user);

router.put(
  "/:user_id",
  [
    authenticate(["admin"], ["garant", "rozvrhář", "vyučující", "student"]),
    check_password,
  ],
  controller.edit_user
);

router.delete(
  "/:user_id",
  authenticate(["admin"], ["garant", "rozvrhář", "vyučující", "student"]),
  controller.delete_user
);

module.exports = router;
