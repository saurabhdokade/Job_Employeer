const express = require("express");
const router = express.Router();
const upload = require("../utils/multerr")
const {
  createEmployerProfile,
  getEmployerProfileById,
  updateEmployerProfile,
  deleteEmployerProfile,
  getAllEmployerProfiles
} = require("../controller/DashBoardController/overviewController");
const { isAuthenticatedUser } = require("../middlewares/auth");

// router.post("/employer-profile", createEmployerProfile);
router.post(
    "/employer-profile",
    isAuthenticatedUser,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    createEmployerProfile
  );

router.put("/profile", isAuthenticatedUser, upload.fields([{ name: 'logo' }, { name: 'banner' }]), updateEmployerProfile);
router.get("/employer-profiles", getAllEmployerProfiles);

module.exports = router;
