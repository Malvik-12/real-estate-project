import { sendInquiryEmailToAdmin } from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

console.log("==================================================");
console.log("📧 TESTING INQUIRY EMAIL DISPATCH");
console.log("Admin Recipient:", process.env.ADMIN_EMAIL);
console.log("==================================================");

const mockInquiry = {
  name: "John Doe (Test Customer)",
  email: "johndoe.buyer@gmail.com",
  phone: "+977 9841000000",
  message: "Hi! I am very interested in this property. Can we schedule a site inspection this Saturday afternoon?",
  property_id: 15,
};

const mockProperty = {
  id: 15,
  title: "Lubhu Home — Modern 2.5 Storey Residential House",
  price: 12432131,
  location: "Lalitpur, Lubhu",
  type: "home",
};

(async () => {
  console.log("Sending test email...");
  const result = await sendInquiryEmailToAdmin(mockInquiry, mockProperty);
  console.log("Result:", result);
  if (result.previewUrl) {
    console.log("\n📬 LIVE PREVIEW LINK (Click to view test email in browser):");
    console.log(result.previewUrl);
  }
  process.exit(0);
})();
