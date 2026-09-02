const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { to, subject, example } = req.body || {};

    if (!to) {
      return res.status(400).json({
        error: "Sähköpostiosoite puuttuu"
      });
    }

    const title = example?.title || "Kawasaki Ninja 500";
    const price = example?.price || 6490;
    const score = example?.score || 94;
    const note = example?.note || "noin 8,5 % alle tyypillisen hinnan";
    const location = example?.location || "Tampere";

    const result = await resend.emails.send({
      from: "Diilivahti <onboarding@resend.dev>",
      to: to,
      subject: subject || "🔥 Diilivahti löysi hyvän diilin!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f5f7fa; padding: 24px;">
          
          <div style="background: white; border-radius: 16px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
            
            <h1 style="margin-top: 0;">
              🔥 Diilivahti löysi hyvän diilin!
            </h1>

            <h2>${title}</h2>

            <p style="font-size: 28px; font-weight: bold;">
              ${price} €
            </p>

            <div style="background: #eef8ee; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <strong style="font-size: 20px;">
                ⭐ Diilipisteet: ${score}/100
              </strong>
              <p style="margin-bottom: 0;">
                📉 ${note}
              </p>
            </div>

            <p>
              📍 <strong>Sijainti:</strong> ${location}
            </p>

            <a href="https://www.google.com"
               style="display: inline-block;
                      background: #111827;
                      color: white;
                      text-decoration: none;
                      padding: 14px 22px;
                      border-radius: 10px;
                      font-weight: bold;">
              Katso ilmoitus →
            </a>

            <hr style="margin: 28px 0; border: none; border-top: 1px solid #eee;">

            <p style="color: #777; font-size: 13px;">
              Tämä on Diilivahdin testihälytys.
            </p>

          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);

      return res.status(500).json({
        error: "Sähköpostin lähetys epäonnistui"
      });
    }

    return res.status(200).json({
      success: true,
      id: result.data?.id || null
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Sähköpostin lähetys epäonnistui"
    });
  }
};
