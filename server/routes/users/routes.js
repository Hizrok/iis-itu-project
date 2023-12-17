const { Router } = require("express");
const { authenticate } = require("../../middleware");
const { generate_id, check_password } = require("./middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_users);
router.get("/:id", authenticate(["admin"], true), controller.get_user);

router.post("/", [authenticate(["admin"]), generate_id], controller.add_user);

router.put(
  "/:id",
  [authenticate(["admin"], true), check_password],
  controller.edit_user
);

router.delete("/:id", authenticate(["admin"], true), controller.delete_user);

module.exports = router;
