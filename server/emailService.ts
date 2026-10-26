import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

// --- Types ---
export interface StressReportData {
  name: string;
  email: string;
  score: number;
  stressLevel: number;
  tierTitle: string;
  tierId: number;
  tierSummary: string;
  primaryGuru: string;
  secondaryGuru?: string;
  domainAverages: Record<string, number>;
  bodyMapAreas?: string[];
}

// --- Gmail SMTP Transport ---
function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: ENV.gmailSmtpUser,
      pass: ENV.gmailSmtpAppPassword,
    },
  });
}

// --- Domain Display Names ---
const DOMAIN_LABELS: Record<string, string> = {
  stress: "Stress Management",
  sleep: "Sleep Quality",
  anxiety: "Anxiety Level",
  relationship: "Relationships",
  motivation: "Energy & Motivation",
  calm: "Inner Peace",
  spiritual: "Spiritual Connection",
};

const DOMAIN_ICONS: Record<string, string> = {
  stress: "⚡",
  sleep: "🌙",
  anxiety: "🌧️",
  relationship: "💛",
  motivation: "🔋",
  calm: "☀️",
  spiritual: "✨",
};

// --- Tier Colors ---
function getTierColor(tierId: number): { bg: string; text: string; accent: string; label: string } {
  switch (tierId) {
    case 1: return { bg: "#E8F5E9", text: "#2E7D32", accent: "#4CAF50", label: "Lower reported pressure" };
    case 2: return { bg: "#FFF8E1", text: "#F57F17", accent: "#FFC107", label: "Some reported pressure" };
    case 3: return { bg: "#FFF3E0", text: "#E65100", accent: "#FF9800", label: "High reported pressure" };
    case 4: return { bg: "#FFEBEE", text: "#B71C1C", accent: "#F44336", label: "Very high reported pressure" };
    default: return { bg: "#F5F5F5", text: "#424242", accent: "#9E9E9E", label: "Unknown" };
  }
}

// --- Severity Label ---
function getSeverityLabel(avg: number): { label: string; color: string } {
  if (avg <= 0.5) return { label: "Lower", color: "#4CAF50" };
  if (avg <= 1.5) return { label: "Noticeable", color: "#FFC107" };
  if (avg <= 2.5) return { label: "Strong", color: "#FF9800" };
  return { label: "Very strong", color: "#F44336" };
}

// --- Quick Tips by Domain ---
function getQuickTips(domainAverages: Record<string, number>, tierId: number): string[] {
  const tips: string[] = [];
  
  // Sort domains by severity (highest first)
  const sorted = Object.entries(domainAverages).sort((a, b) => b[1] - a[1]);
  const topDomains = sorted.slice(0, 3).map(([d]) => d);

  if (topDomains.includes("stress") || tierId >= 3) {
    tips.push("🧊 <strong>Name the next decision:</strong> Write down the one task, conversation, or boundary that needs action. Put the rest on a later list so tonight does not have to carry the whole week.");
    tips.push("📝 <strong>Close the work loop:</strong> Before you stop for the day, write tomorrow's first action. This gives unfinished work a place to wait outside your head.");
  }

  if (topDomains.includes("sleep")) {
    tips.push("🌙 <strong>Make the last step repeatable:</strong> Choose one low-stimulation activity you can repeat before bed, even on a busy night. Keep it small enough that it does not become another performance goal.");
    tips.push("📱 <strong>Give work a stopping point:</strong> Pick a realistic time to stop checking work messages. Persistent sleep problems or daytime impairment deserve a conversation with a qualified health professional.");
  }

  if (topDomains.includes("anxiety")) {
    tips.push("🦶 <strong>Use a sensory check:</strong> Name three things you see, two points of contact with the chair or floor, and one sound. Stop if the practice feels uncomfortable or more distressing.");
    tips.push("🚶 <strong>Choose the next five minutes:</strong> Name one action you can take now instead of planning every possible outcome. A short walk can also create a clean break if it is safe and available to you.");
  }

  if (topDomains.includes("relationship")) {
    tips.push("💬 <strong>Make one clear request:</strong> Describe the task or impact, then ask for a specific change. Avoid trying to settle every past disagreement in the same conversation.");
    tips.push("🎧 <strong>Ask before solving:</strong> Try, \"Would you like ideas, help, or for me to listen?\" A direct question can reduce guesswork for both people.");
  }

  if (topDomains.includes("motivation")) {
    tips.push("🎯 <strong>Shrink the start:</strong> Define an action that takes ten minutes or less. Decide what finished means for that first round before you begin.");
    tips.push("🌤️ <strong>Check the conditions:</strong> Low motivation can reflect overload, poor sleep, low mood, or an unclear task. Persistent or worsening changes are worth discussing with a qualified professional.");
  }

  if (topDomains.includes("calm")) {
    tips.push("🫁 <strong>Try an easy exhale:</strong> If breathing exercises feel comfortable, let the exhale run slightly longer than the inhale for three rounds. Skip breath holds and return to normal breathing if you feel dizzy or distressed.");
  }

  if (topDomains.includes("spiritual")) {
    tips.push("🙏 <strong>Use a values check:</strong> Name one value you want today to reflect. Choose one small action that supports it without turning the exercise into another score.");
  }

  tips.push("🤝 <strong>Match support to the problem:</strong> A wellness prompt can help with reflection. Unsafe work, severe symptoms, relationship violence, or a health concern requires qualified human support.");
  tips.push("🎵 <strong>Create a transition cue:</strong> Choose a familiar song, short walk, or quiet routine that marks the end of work and the beginning of your next role.");

  return tips.slice(0, 7); // Return max 7 tips
}

// --- Body Map Display ---
function formatBodyMapAreas(areas?: string[]): string {
  if (!areas || areas.length === 0) return "No tension areas reported";
  const areaLabels: Record<string, string> = {
    head: "Head & Temples",
    neck: "Neck",
    shoulders: "Shoulders",
    chest: "Chest",
    upper_back: "Upper Back",
    lower_back: "Lower Back",
    stomach: "Stomach",
    hips: "Hips",
    arms: "Arms",
    hands: "Hands",
    legs: "Legs",
    feet: "Feet",
  };
  return areas.map(a => areaLabels[a] || a).join(", ");
}

// --- Build HTML Email ---
function buildStressReportHTML(data: StressReportData): string {
  const tierColor = getTierColor(data.tierId);
  const tips = getQuickTips(data.domainAverages, data.tierId);
  const logoUrl = "https://stressguru.ai/images/tSoUYtGDntwznQDV.png";
  const appStoreUrl = "https://apps.apple.com/us/app/stressguru-ai/id6748682052";

  // Build domain bars
  const domainBarsHTML = Object.entries(data.domainAverages)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, avg]) => {
      const severity = getSeverityLabel(avg);
      const pct = Math.round((avg / 3) * 100);
      const icon = DOMAIN_ICONS[domain] || "📊";
      const label = DOMAIN_LABELS[domain] || domain;
      return `
        <tr>
          <td style="padding: 10px 0; font-size: 14px; color: #374151; width: 45%;">
            ${icon} ${label}
          </td>
          <td style="padding: 10px 0; width: 40%;">
            <div style="background: #F3F4F6; border-radius: 10px; height: 12px; overflow: hidden;">
              <div style="background: ${severity.color}; height: 100%; width: ${Math.max(pct, 5)}%; border-radius: 10px;"></div>
            </div>
          </td>
          <td style="padding: 10px 0; text-align: right; width: 15%;">
            <span style="font-size: 12px; font-weight: 700; color: ${severity.color};">${severity.label}</span>
          </td>
        </tr>`;
    })
    .join("");

  // Build tips HTML
  const tipsHTML = tips
    .map(
      (tip) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F3F4F6; font-size: 14px; color: #374151; line-height: 1.6;">
          ${tip}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your StressGuru Stress Profile Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
              <img src="${logoUrl}" alt="StressGuru" width="64" height="64" style="border-radius: 50%; margin-bottom: 16px;" />
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">StressGuru</h1>
              <p style="margin: 4px 0 0; color: #7BDDE5; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">STOP STRESS TODAY</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background: #FFFFFF; padding: 32px 32px 16px;">
              <h2 style="margin: 0 0 8px; color: #0F172A; font-size: 22px; font-weight: 700;">Hi ${data.name},</h2>
              <p style="margin: 0; color: #64748B; font-size: 15px; line-height: 1.6;">
                Thank you for completing your Stress Profile Assessment. Below is your personalized report with actionable insights to help you take control of your well-being.
              </p>
            </td>
          </tr>

          <!-- Score Card -->
          <tr>
            <td style="background: #FFFFFF; padding: 16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${tierColor.bg}; border-radius: 16px; border: 2px solid ${tierColor.accent}20;">
                <tr>
                  <td style="padding: 28px; text-align: center;">
                    <div style="display: inline-block; background: #FFFFFF; border-radius: 50%; width: 100px; height: 100px; line-height: 100px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 16px;">
                      <span style="font-size: 36px; font-weight: 800; color: ${tierColor.text};">${data.score}</span>
                    </div>
                    <h3 style="margin: 0 0 4px; color: ${tierColor.text}; font-size: 24px; font-weight: 700;">${data.tierTitle}</h3>
                    <p style="margin: 0 0 8px; color: ${tierColor.text}; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Stress Level: ${data.stressLevel}/9 &bull; ${tierColor.label}</p>
                    <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5; max-width: 400px; display: inline-block;">${data.tierSummary}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Domain Breakdown -->
          <tr>
            <td style="background: #FFFFFF; padding: 24px 32px;">
              <h3 style="margin: 0 0 4px; color: #0F172A; font-size: 18px; font-weight: 700;">Your Wellness Breakdown</h3>
              <p style="margin: 0 0 16px; color: #94A3B8; font-size: 13px;">How you scored across each area of well-being</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${domainBarsHTML}
              </table>
            </td>
          </tr>

          <!-- Body Tension Map -->
          <tr>
            <td style="background: #FFFFFF; padding: 16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="margin: 0 0 8px; color: #0F172A; font-size: 15px; font-weight: 700;">🫀 Body Tension Map</h4>
                    <p style="margin: 0; color: #64748B; font-size: 14px; line-height: 1.5;">
                      <strong>Areas of tension:</strong> ${formatBodyMapAreas(data.bodyMapAreas)}
                    </p>
                    ${data.bodyMapAreas && data.bodyMapAreas.length >= 3 ? `
                    <p style="margin: 8px 0 0; color: #B45309; font-size: 13px; line-height: 1.5; background: #FEF3C7; padding: 8px 12px; border-radius: 8px;">
                      You selected ${data.bodyMapAreas.length} areas. This reflects your answers and does not identify a medical cause. Consider a comfortable break, and speak with a qualified professional about new, persistent, or concerning physical symptoms.
                    </p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recommended Guru -->
          <tr>
            <td style="background: #FFFFFF; padding: 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: 16px;">
                <tr>
                  <td style="padding: 28px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #7BDDE5; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Your Recommended Guru</p>
                    <h3 style="margin: 0 0 8px; color: #FFFFFF; font-size: 22px; font-weight: 700;">${data.primaryGuru} Guru</h3>
                    <p style="margin: 0 0 16px; color: #CBD5E1; font-size: 14px; line-height: 1.5;">
                      Based on the answers you selected, the ${data.primaryGuru} Guru is an AI wellness persona you may want to explore first. This match is not a diagnosis or clinical recommendation.
                    </p>
                    ${data.secondaryGuru ? `
                    <p style="margin: 0; color: #94A3B8; font-size: 13px;">
                      Also recommended: <strong style="color: #7BDDE5;">${data.secondaryGuru} Guru</strong>
                    </p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Tips -->
          <tr>
            <td style="background: #FFFFFF; padding: 24px 32px;">
              <h3 style="margin: 0 0 4px; color: #0F172A; font-size: 18px; font-weight: 700;">🎯 Your Personalized Quick Tips</h3>
              <p style="margin: 0 0 16px; color: #94A3B8; font-size: 13px;">Small wellness options based on the areas you selected</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                ${tipsHTML}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background: #FFFFFF; padding: 24px 32px 32px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #7BDDE5 0%, #5BC5CD 100%); border-radius: 16px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <h3 style="margin: 0 0 8px; color: #0F172A; font-size: 20px; font-weight: 700;">Choose one useful next step</h3>
                    <p style="margin: 0 0 20px; color: #1E293B; font-size: 14px; line-height: 1.5;">
                      Explore the free Relief plan and open the ${data.primaryGuru} Guru AI wellness persona when you want a short reflection or practice.
                    </p>
                    <a href="${appStoreUrl}" target="_blank" style="display: inline-block; background: #0F172A; color: #FFFFFF; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 50px; text-decoration: none;">
                      Download Free on iOS
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #0F172A; border-radius: 0 0 16px 16px; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #94A3B8; font-size: 12px;">
                This report was generated by StressGuru based on your Stress Profile Assessment.
              </p>
              <p style="margin: 0 0 8px; color: #94A3B8; font-size: 12px;">
                It is not a medical diagnosis or treatment recommendation. In the United States, call or text 988 for crisis support. For immediate danger, call 911.
              </p>
              <p style="margin: 0; color: #64748B; font-size: 11px;">
                &copy; ${new Date().getFullYear()} StressGuru &bull; <a href="https://stressguru.ai" style="color: #7BDDE5; text-decoration: none;">stressguru.ai</a> &bull; <a href="mailto:support@stressguru.ai" style="color: #7BDDE5; text-decoration: none;">support@stressguru.ai</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// --- Send Email ---
export async function sendStressReport(data: StressReportData): Promise<boolean> {
  try {
    const transporter = createTransport();
    const html = buildStressReportHTML(data);

    const mailOptions = {
      from: `"StressGuru" <${ENV.gmailSmtpUser}>`,
      to: data.email,
      cc: ENV.gmailSmtpUser,
      subject: `${data.name}, Your Stress Profile Report is Ready`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Stress report sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send stress report:", error);
    return false;
  }
}
