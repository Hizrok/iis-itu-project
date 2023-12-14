const { Router } = require("express");
const { authenticate } = require("../../middleware");

const controller = require("./controller");

const router = Router();

router.get("/", authenticate(["admin"]), controller.get_instances);

router.post("/", authenticate(["admin"]), controller.add_instance);

router.put("/:id", authenticate(["admin"]), controller.edit_instance);

router.delete("/:id", authenticate(["admin"]), controller.delete_instance);

module.exports = router;
