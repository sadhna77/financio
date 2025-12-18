const { sendEmail } = require("../service/emailService");

const ContactEmail = async (req, res) => {
  const { email, Name, message } = req.body;
  console.log(req.body)

  if (!email || !Name || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const htmlMessage = `
<h2>Hi {{name}},</h2>
<p style="font-size:16px;">
We’ve noticed that your budget for this month is almost <b>used up</b> 💸.
</p>

<p style="font-size:16px;">
You’ve reached the <b>red zone</b> — your remaining balance is very low.
It’s a good time to review your recent expenses and adjust your spending habits before your budget runs out completely.
</p>

<ul style="font-size:15px;">
  <li>🧾 Check unnecessary expenses</li>
  <li>🍔 Cut down on food or entertainment overspending</li>
  <li>💰 Try to save a small portion before the month ends</li>
</ul>

<p style="font-size:16px;">
Stay on track and keep your financial goals strong 💪
</p>

<p style="font-size:14px;color:gray;">
— Your FinTrack Team
</p>

`;

  try {
    await sendEmail(
      email,
      "Thanks for Reaching Out - CarZo!",
      message,
      htmlMessage
    );

    res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email send failed", error: error.message });
  }
};

module.exports = { ContactEmail };
