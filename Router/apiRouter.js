const router = require("express").Router();
const usersRouter = require("./usersRouter");
const authRouter = require("./authRouter");
const groupsRouter = require("./groupsRouter");

// router.use("/campuses", campusRouter);
// router.use("/students", studentRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/groups", groupsRouter);

module.exports = router;
