const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Sähköpostiosoite puuttuu" });
    }

    const result = await resend.emails.send({
      from: "Diilivahti <onboarding@resend.dev>",
      to: email,
      subject: "Diilivahti – testisähköposti",
      html: `
        <h2>Diilivahti toimii! 🎉</h2>
        <p>Tämä on Diilivahdin testisähköposti.</p>
        <p>Backend → Vercel → Resend toimii.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      id: result.data?.id || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Sähköpostin lähetys epäonnistui",
    });
  }
};
