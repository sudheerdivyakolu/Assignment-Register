const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/signup$", userController.handleSignup);

router.post("/login$", userController.handleLogin);

router.get("/session-data", userController.handleSessionData);

router.post("/logout$", userController.handleLogout);

router.delete("/user$", userController.handleDelete);

module.exports = router;
