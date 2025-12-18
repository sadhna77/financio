
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dreamsmine44@gmail.com",
    pass: "svwy txke wxbj sbho", // app password
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: '"Financio" <dreamsmine44@gmail.com>',
      to,
      subject,
      html: htmlContent, // ✅ ONLY HTML
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

module.exports = {sendEmail};

