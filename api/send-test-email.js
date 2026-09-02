const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, example } = req.body || {};

    if (!to) {
      return res.status(400).json({
        error: "Sähköpostiosoite puuttuu"
      });
    }

    const title = example?.title || "Diilivahti";
    const price = example?.price || "";
    const score = example?.score || "";
    const note = example?.note || "";
    const location = example?.location || "";

    const result = await resend.emails.send({
      from: "Diilivahti <onboarding@resend.dev>",
      to: to,
      subject: subject || "🔥 Testi-ilmoitus — Diilivahti",
      html: `
        <h2>🔥 Diilivahti – testi-ilmoitus</h2>
        <h3>${title}</h3>
        <p><strong>Hinta:</strong> ${price} €</p>
        <p><strong>Diilipisteet:</strong> ${score}</p>
        <p><strong>Arvio:</strong> ${note}</p>
        <p><strong>Sijainti:</strong> ${location}</p>
        <hr>
        <p>Tämä on Diilivahdin testisähköposti.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      id: result.data?.id || null,
    });

  } catch (error) {
    console.error("Resend error:", error);

    return res.status(500).json({
      error: "Sähköpostin lähetys epäonnistui"
    });
  }
};
