import re

routes_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\server\cateringRoutes.ts"

with open(routes_path, "r", encoding="utf-8") as f:
    code = f.read()

# Add buildStaffWelcomeEmailHtml
email_builder_code = '''
function buildStaffWelcomeEmailHtml(data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: string;
  loginUrl: string;
}): string {
  return `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;margin:0;">
    <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#166534,#16a34a);padding:28px 32px;">
        <h2 style="color:#ffffff;margin:0;font-size:22px;">TOCEPS Staff Onboarding Credentials</h2>
        <p style="color:#bbf7d0;margin:6px 0 0;font-size:14px;">TOTAG Catering & Events Planning Services — Operational Command Portal</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;margin:0 0 16px;color:#1e293b;">Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
          Welcome to <strong>TOTAG Group of Companies Ltd</strong>. Your staff user account has been successfully provisioned on the <strong>TOCEPS Operations Portal</strong>.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-bottom:24px;">
          <h4 style="margin:0 0 14px;font-size:12px;color:#15803d;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Your Account Credentials & Role</h4>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;width:35%;">Staff User</td><td style="padding:6px 0;font-weight:bold;color:#0f172a;">${data.firstName} ${data.lastName}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Username</td><td style="padding:6px 0;font-weight:bold;color:#0f172a;font-family:monospace;font-size:15px;">${data.username}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Temporary Password</td><td style="padding:6px 0;font-weight:bold;color:#dc2626;font-family:monospace;font-size:15px;">${data.password}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Assigned Operational Role</td><td style="padding:6px 0;font-weight:bold;color:#15803d;">${data.role}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Portal Access Address</td><td style="padding:6px 0;color:#2563eb;"><a href="${data.loginUrl}" style="color:#2563eb;text-decoration:none;">${data.loginUrl}</a></td></tr>
          </table>
        </div>

        <div style="margin-bottom:24px;padding:16px;background:#fefce8;border-left:4px solid #ca8a04;border-radius:6px;">
          <strong style="font-size:13px;color:#854d0e;display:block;margin-bottom:6px;">⚠️ MANDATORY SECURITY DIRECTIVE: CHANGE YOUR PASSWORD</strong>
          <p style="margin:0;font-size:13px;color:#713f12;line-height:1.5;">
            You have been issued a temporary password. For enterprise security compliance, you are required to log in immediately and <strong>change your temporary password</strong> under your account settings.
          </p>
        </div>

        <div style="background:#166534;border-radius:10px;padding:18px;text-align:center;margin-bottom:24px;">
          <a href="${data.loginUrl}" style="color:#ffffff;font-weight:bold;text-decoration:none;font-size:15px;display:inline-block;">Log In to Staff Portal & Update Password →</a>
        </div>

        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.5;">
          TOCEPS Operations Desk | TOTAG Group of Companies Ltd | Monrovia, Liberia<br/>
          If you have questions regarding your assigned role, contact your Account Manager.
        </p>
      </div>
    </div></body></html>
  `;
}
'''

# Insert email builder function right before router.post("/staff")
post_staff_pattern = r'router\.post\("/staff", authenticateCateringStaff, requireCateringRole\("account_manager"\), async \(req: CateringAuthRequest, res: Response\) => \{'

new_post_staff = email_builder_code + '''
router.post("/staff", authenticateCateringStaff, requireCateringRole("account_manager"), async (req: CateringAuthRequest, res: Response) => {
  try {
    const { username, password, email, firstName, lastName, phone, role } = req.body;
    if (!username || !password || !email || !firstName || !lastName || !role) {
      return res.status(400).json({ success: false, error: "Missing required fields (username, password, email, firstName, lastName, role)" });
    }

    const existing = await storage.getCateringStaffByUsername(username);
    if (existing) {
      return res.status(400).json({ success: false, error: `Username '${username}' is already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newStaff = await storage.createCateringStaff({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phone: phone || "",
      role,
      isActive: true,
    });

    // Role Labels Map for Email
    const roleLabels: Record<string, string> = {
      account_manager: "LTA Account Manager / Admin",
      operations_supervisor: "General Operations Manager",
      head_chef: "Catering Lead / Head Chef",
      food_safety_supervisor: "Food Safety & Quality Supervisor",
      team_lead: "Service Team Lead",
      logistics_coordinator: "Logistics & Transport Coordinator",
    };

    const roleTitle = roleLabels[role] || role;
    const loginUrl = "https://totag.network/catering/ops/login";
    const emailHtml = buildStaffWelcomeEmailHtml({
      firstName,
      lastName,
      username,
      password, // Plain text temporary password set by admin to be emailed
      email,
      role: roleTitle,
      loginUrl,
    });

    let sent = false;
    try {
      sent = await EmailService.sendEmail({
        to: email,
        from: TOCEPS_FROM,
        subject: `[TOCEPS Staff Onboarding] Account Credentials & Role: ${roleTitle}`,
        html: emailHtml,
        text: `Dear ${firstName} ${lastName},\\n\\nWelcome to TOCEPS Catering & Events Services (TOTAG Group of Companies Ltd).\\n\\nYour staff account has been created:\\nUsername: ${username}\\nTemporary Password: ${password}\\nRole: ${roleTitle}\\n\\nPlease log in at ${loginUrl} and change your temporary password under Profile Settings.\\n\\nBest regards,\\nTOCEPS Operations Management\\nTOTAG Group of Companies Ltd`,
        type: "notification" as const,
      });
      console.log(`📧 Staff onboarding email sent to ${email} (Result: ${sent})`);
    } catch (emailErr: any) {
      console.error("Failed to send staff onboarding email:", emailErr.message);
    }

    const { password: _, ...safeStaff } = newStaff;
    res.status(201).json({
      success: true,
      staff: safeStaff,
      emailSent: sent,
      message: `Staff account '${username}' created! Onboarding email ${sent ? "sent to " + email : "generated (service check)"}.`
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || "Failed to create staff member" });
  }
});'''

# Replace old router.post("/staff") with new implementation
old_post_staff_pattern = r'router\.post\("/staff", authenticateCateringStaff, requireCateringRole\("account_manager"\), async \(req: CateringAuthRequest, res: Response\) => \{[\s\S]*?\n\}\);'

if re.search(old_post_staff_pattern, code):
    updated_code = re.sub(old_post_staff_pattern, new_post_staff, code)
    with open(routes_path, "w", encoding="utf-8") as f:
        f.write(updated_code)
    print("Successfully updated server/cateringRoutes.ts with staff onboarding email dispatch!")
else:
    print("Could not find router.post('/staff') pattern!")
