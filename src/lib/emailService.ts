import * as nodemailer from 'nodemailer'

// Email configuration using Hostinger SMTP
const emailConfig = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER || 'info@mudrabase.in',
    pass: process.env.EMAIL_PASSWORD || 'Mudrabase@411'
  }
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig)

// Email templates
export const emailTemplates = {
  welcome: (userData: {
    name: string
    email: string
    employeeId: string
    role: string
    branchName?: string
    stateName?: string | null
    regionName?: string | null
    areaName?: string | null
    password: string
    bankName?: string
    bankAccountHolderName?: string
    bankAccountNumber?: string
    bankIfscCode?: string
    upiId?: string
  }) => ({
    subject: '🎉 Welcome to Mudrabase Solar CRM - Your Account Details',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Mudrabase Solar CRM</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
          .content { padding: 40px 30px; }
          .welcome-box { background: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .credentials-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .credential-item { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .credential-label { font-weight: 600; color: #555; }
          .credential-value { font-family: 'Courier New', monospace; background: #f1f3f4; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          .login-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
          .login-button:hover { transform: translateY(-2px); }
          .security-note { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">☀️ Mudrabase Solar CRM</div>
            <h1>Welcome to the Team!</h1>
          </div>
          
          <div class="content">
            <div class="welcome-box">
              <h2 style="margin-top: 0; color: #667eea;">🎊 Hello ${userData.name}!</h2>
              <p>We're excited to welcome you to Mudrabase Solar CRM. Your account has been successfully created and you're ready to start managing solar installations and leads.</p>
            </div>

            <h3>📋 Your Account Details:</h3>
            <div class="credentials-box">
              <div class="credential-item">
                <span class="credential-label">👤 Full Name:</span>
                <span class="credential-value">${userData.name}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">🆔 Employee ID:</span>
                <span class="credential-value">${userData.employeeId}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">📧 Email:</span>
                <span class="credential-value">${userData.email}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">🏢 Role:</span>
                <span class="credential-value">${userData.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
              ${userData.branchName ? `
              <div class="credential-item">
                <span class="credential-label">🏪 Branch:</span>
                <span class="credential-value">${userData.branchName}</span>
              </div>
              ` : ''}
              <div class="credential-item">
                <span class="credential-label">🔑 Password:</span>
                <span class="credential-value">${userData.password}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://solar-crm.mudrabase.in'}/login" class="login-button">
                🚀 Login to CRM System
              </a>
            </div>

            <div class="security-note">
              <h4 style="margin-top: 0;">🔒 Security Reminder:</h4>
              <ul style="margin: 10px 0;">
                <li>Please change your password after first login</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Never share your password with anyone</li>
                <li>Contact IT support if you face any login issues</li>
              </ul>
            </div>

            <h3>🚀 Getting Started:</h3>
            <ol>
              <li><strong>Login:</strong> Use the credentials above to access the system</li>
              <li><strong>Complete Profile:</strong> Upload your profile photo and KYC documents</li>
              <li><strong>Explore:</strong> Familiarize yourself with the dashboard and features</li>
              <li><strong>Start Working:</strong> Begin managing leads and installations</li>
            </ol>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p style="margin-top: 30px;">
              <strong>Welcome aboard! 🎉</strong><br>
              <em>The Mudrabase Solar Team</em>
            </p>
          </div>

          <div class="footer">
            <p><strong>Mudrabase Solar CRM</strong></p>
            <p>📧 info@mudrabase.in | 🌐 www.mudrabase.in</p>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Mudrabase Solar CRM!

Hello ${userData.name},

Your account has been successfully created. Here are your login details:

Employee ID: ${userData.employeeId}
Email: ${userData.email}
Role: ${userData.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
${userData.branchName ? `Branch: ${userData.branchName}` : ''}
Password: ${userData.password}

Login URL: ${process.env.NEXT_PUBLIC_APP_URL || 'https://solar-crm.mudrabase.in'}/login

Security Reminder:
- Please change your password after first login
- Keep your credentials secure and confidential
- Contact support if you need assistance

Welcome to the team!

The Mudrabase Solar Team
info@mudrabase.in
    `
  })
}

// Send email function
export async function sendEmail(to: string, template: { subject: string; html: string; text: string }) {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email configuration missing - EMAIL_USER or EMAIL_PASSWORD not set')
      return { success: false, error: 'Email configuration not available' }
    }

    console.log('📧 Sending email to:', to)
    console.log('📧 Email subject:', template.subject)
    console.log('📧 SMTP Config:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user
    })
    
    const info = await transporter.sendMail({
      from: `"Mudrabase Solar CRM" <${emailConfig.auth.user}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    console.log('✅ Email sent successfully!')
    console.log('📧 Message ID:', info.messageId)
    console.log('📧 Response:', info.response)
    return { success: true, messageId: info.messageId, response: info.response }
  } catch (error: any) {
    console.error('❌ Email send failed:', error)
    console.error('❌ Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    })
    return { success: false, error: error.message, details: error }
  }
}

// Send welcome email specifically
export async function sendWelcomeEmail(userData: {
  name: string
  email: string
  employeeId: string
  role: string
  branchName?: string
  stateName?: string | null
  regionName?: string | null
  areaName?: string | null
  password: string
  bankName?: string
  bankAccountHolderName?: string
  bankAccountNumber?: string
  bankIfscCode?: string
  upiId?: string
}) {
  const template = emailTemplates.welcome(userData)
  return await sendEmail(userData.email, template)
}
