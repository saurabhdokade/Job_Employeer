const mongoose = require("mongoose");

const employerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employe",
    required: true,
    unique: true, // one profile per user
  },
    companyInfo: {
      logoUrl: { type: String },
      bannerUrl: { type: String },
      companyName: { type: String, required: true },
      aboutUs: { type: String }
    },
    foundingInfo: {
      organizationType: {
        type: String,
        enum: ["Private", "Public", "Government", "Non-Profit", "Startup"],
        required: true
      },
      industryType: {
        type: String,
        enum: ["IT", "Healthcare", "Education", "Finance", "Manufacturing", "Retail", "Other"],
        required: true
      },
      teamSize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
        required: true
      },
      establishmentYear: { type: Date },
      companyWebsite: { type: String },
      companyVision: { type: String }
    },
    socialMedia: [
      {
        platform: {
          type: String,
          enum: ["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube", "Other"],
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    accountSettings: {
        mapLocation: {
          type: String,
          required: false, // Set to true if location is mandatory
        },
        phone: {
          countryCode: {
            type: String,
            default: '+91', // Default India code; you can adjust if needed
          },
          number: {
            type: String,
            required: true,
            match: /^[0-9]{7,15}$/ // Basic validation: 7 to 15 digits
          },
        },
        email: {
          type: String,
          required: true,
          match: /.+\@.+\..+/,
          lowercase: true,
          unique: true,
        }
      }
      
  }, {
    timestamps: true
  });
  

 module.exports = mongoose.model("EmployerProfile", employerProfileSchema);
  