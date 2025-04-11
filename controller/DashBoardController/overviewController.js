const EmployerProfile = require("../../model/overviewModel");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHander = require("../../utils/errorhandler");

// Create Employer Profile
// exports.createEmployerProfile = catchAsyncErrors(async (req, res, next) => {
//   const {
//     companyInfo,
//     foundingInfo,
//     socialMedia,
//     accountSettings
//   } = req.body;

//   // ✅ Validate required fields from companyInfo
//   if (!companyInfo?.companyName || !foundingInfo?.organizationType || !foundingInfo?.industryType || !foundingInfo?.teamSize || !accountSettings?.phone?.number || !accountSettings?.email) {
//     return next(new ErrorHander("Missing required fields.", 400));
//   }

//   // 📧 Check if email already exists
//   const existingProfile = await EmployerProfile.findOne({ "accountSettings.email": accountSettings.email });
//   if (existingProfile) {
//     return next(new ErrorHander("Employer profile already exists with this email.", 400));
//   }

//   // 🛠 Create new employer profile
//   const newProfile = await EmployerProfile.create({
//     companyInfo,
//     foundingInfo,
//     socialMedia,
//     accountSettings
//   });

//   res.status(201).json({
//     success: true,
//     message: "Employer profile created successfully.",
//     profile: newProfile
//   });
// });




// exports.createEmployerProfile = catchAsyncErrors(async (req, res, next) => {
//     const {
//       companyInfo: companyInfoBody,
//       foundingInfo,
//       socialMedia,
//       accountSettings,
//     } = req.body;
  
//     // Extract uploaded file paths
//     const logo = req.files?.logo?.[0]?.path || null;
//     const banner = req.files?.banner?.[0]?.path || null;
  
//     // Construct companyInfo with uploaded file URLs
//     const companyInfo = {
//       ...JSON.parse(companyInfoBody), // Because multipart sends it as string
//       logoUrl: logo,
//       bannerUrl: banner,
//     };
  
//     // Validate required fields
//     if (
//       !companyInfo?.companyName ||
//       !foundingInfo?.organizationType ||
//       !foundingInfo?.industryType ||
//       !foundingInfo?.teamSize ||
//       !accountSettings?.phone?.number ||
//       !accountSettings?.email
//     ) {
//       return next(new ErrorHander("Missing required fields.", 400));
//     }
  
//     // Check for existing profile by email
//     const existingProfile = await EmployerProfile.findOne({
//       "accountSettings.email": accountSettings.email,
//     });
//     if (existingProfile) {
//       return next(
//         new ErrorHander("Employer profile already exists with this email.", 400)
//       );
//     }
  
//     const newProfile = await EmployerProfile.create({
//       companyInfo,
//       foundingInfo,
//       socialMedia,
//       accountSettings,
//     });
  
//     res.status(201).json({
//       success: true,
//       message: "Employer profile created successfully.",
//       profile: newProfile,
//     });
// });
  

exports.createEmployerProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    companyInfo: companyInfoBody,
    foundingInfo,
    socialMedia,
    accountSettings,
  } = req.body;

  // Get current logged-in user
  const userId = req.user._id;

  const logo = req.files?.logo?.[0]?.path || null;
  const banner = req.files?.banner?.[0]?.path || null;

  const companyInfo = {
    ...JSON.parse(companyInfoBody),
    logoUrl: logo,
    bannerUrl: banner,
  };

  if (
    !companyInfo?.companyName ||
    !foundingInfo?.organizationType ||
    !foundingInfo?.industryType ||
    !foundingInfo?.teamSize ||
    !accountSettings?.phone?.number ||
    !accountSettings?.email
  ) {
    return next(new ErrorHander("Missing required fields.", 400));
  }

  const existingProfile = await EmployerProfile.findOne({
    "accountSettings.email": accountSettings.email,
  });
  if (existingProfile) {
    return next(
      new ErrorHander("Employer profile already exists with this email.", 400)
    );
  }

  const newProfile = await EmployerProfile.create({
    user: userId, // 🔥 store employer's user ID
    companyInfo,
    foundingInfo,
    socialMedia,
    accountSettings,
  });

  res.status(201).json({
    success: true,
    message: "Employer profile created successfully.",
    profile: newProfile,
  });
});


// exports.updateEmployerProfile = catchAsyncErrors(async (req, res, next) => {
//   const {
//     companyInfo: companyInfoBody,
//     foundingInfo,
//     socialMedia,
//     accountSettings,
//   } = req.body;

//   const userId = req.user._id;

//   const logo = req.files?.logo?.[0]?.path;
//   const banner = req.files?.banner?.[0]?.path;

//   const companyInfoParsed = JSON.parse(companyInfoBody) || {};
//   if (logo) companyInfoParsed.logoUrl = logo;
//   if (banner) companyInfoParsed.bannerUrl = banner;

//   if (
//     !companyInfoParsed?.companyName ||
//     !foundingInfo?.organizationType ||
//     !foundingInfo?.industryType ||
//     !foundingInfo?.teamSize ||
//     !accountSettings?.phone?.number ||
//     !accountSettings?.email
//   ) {
//     return next(new ErrorHander("Missing required fields.", 400));
//   }

//   // Find and update the existing profile
//   const existingProfile = await EmployerProfile.findOne({ user: userId });

//   if (!existingProfile) {
//     return next(new ErrorHander("Employer profile not found.", 404));
//   }

//   existingProfile.companyInfo = {
//     ...existingProfile.companyInfo,
//     ...companyInfoParsed,
//   };

//   existingProfile.foundingInfo = {
//     ...existingProfile.foundingInfo,
//     ...foundingInfo,
//   };

//   existingProfile.socialMedia = {
//     ...existingProfile.socialMedia,
//     ...socialMedia,
//   };

//   existingProfile.accountSettings = {
//     ...existingProfile.accountSettings,
//     ...accountSettings,
//   };

//   await existingProfile.save();

//   res.status(200).json({
//     success: true,
//     message: "Employer profile updated successfully.",
//     profile: existingProfile,
//   });
// });

const qs = require('qs');

exports.updateEmployerProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Convert flat form-data into nested object using qs
  const parsedBody = qs.parse(req.body);

  const {
    companyInfo: companyInfoBody,
    foundingInfo,
    socialMedia,
    accountSettings,
  } = parsedBody;

  const logo = req.files?.logo?.[0]?.path;
  const banner = req.files?.banner?.[0]?.path;

  let companyInfoParsed = {};
  try {
    companyInfoParsed = JSON.parse(companyInfoBody);
  } catch (error) {
    return next(new ErrorHander("Invalid companyInfo JSON format", 400));
  }

  if (logo) companyInfoParsed.logoUrl = logo;
  if (banner) companyInfoParsed.bannerUrl = banner;

  if (
    !companyInfoParsed?.companyName ||
    !foundingInfo?.organizationType ||
    !foundingInfo?.industryType ||
    !foundingInfo?.teamSize ||
    !accountSettings?.phone?.number ||
    !accountSettings?.email
  ) {
    return next(new ErrorHander("Missing required fields.", 400));
  }

  const existingProfile = await EmployerProfile.findOne({ user: userId });
  if (!existingProfile) {
    return next(new ErrorHander("Employer profile not found.", 404));
  }

  existingProfile.companyInfo = {
    ...existingProfile.companyInfo,
    ...companyInfoParsed,
  };

  existingProfile.foundingInfo = {
    ...existingProfile.foundingInfo,
    ...foundingInfo,
  };

  existingProfile.socialMedia = socialMedia || [];

  existingProfile.accountSettings = {
    ...existingProfile.accountSettings,
    ...accountSettings,
  };

  await existingProfile.save();

  res.status(200).json({
    success: true,
    message: "Employer profile updated successfully.",
    profile: existingProfile,
  });
});


exports.getAllEmployerProfiles = catchAsyncErrors(async (req, res, next) => {
  const profiles = await EmployerProfile.find().populate("user");
  const totalCount = await EmployerProfile.countDocuments();

  res.status(200).json({
    success: true,
    message: "All employer profiles fetched successfully",
    totalCount,
    profiles,
  });
});