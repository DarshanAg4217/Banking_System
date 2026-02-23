require('dotenv').config();


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
    }
});

async function sendEmail(to, subject, text, html) {
    try {
        await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            html
        });

        console.log("Email sent successfully ✅");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger 🎉';

    const text = `
Hello ${name},

Thank you for registering at Backend Ledger.

We are excited to have you onboard.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>Welcome Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
            <tr>
                <td align="center">
                    
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background:#0d6efd; padding:30px;">
                                <h1 style="color:#ffffff; margin:0;">Backend Ledger</h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px 30px;">
                                <h2 style="color:#333333; margin-top:0;">Welcome, ${name}! 👋</h2>
                                <p style="color:#555555; font-size:16px; line-height:1.6;">
                                    Thank you for registering with <strong>Backend Ledger</strong>.
                                    We’re thrilled to have you as part of our community.
                                </p>

                                <p style="color:#555555; font-size:16px; line-height:1.6;">
                                    You can now explore all features and start managing your backend operations efficiently.
                                </p>

                                <!-- Button -->
                                <div style="text-align:center; margin:30px 0;">
                                    <a href="https://yourwebsite.com/login" 
                                       style="background:#0d6efd; color:#ffffff; padding:12px 25px; 
                                              text-decoration:none; border-radius:5px; 
                                              font-size:16px; display:inline-block;">
                                        Login to Your Account
                                    </a>
                                </div>

                                <p style="color:#777777; font-size:14px;">
                                    If you have any questions, feel free to contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="background:#f1f1f1; padding:20px; font-size:13px; color:#888888;">
                                © ${new Date().getFullYear()} Backend Ledger. All rights reserved.
                                <br />
                                This is an automated email, please do not reply.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
    const subject = 'New Login Alert - Backend Ledger 🔐';

    const text = `
Hello ${name},

Your account was just logged into successfully.

If this was you, no action is required.

If this wasn't you, please reset your password immediately.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>Login Alert</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
            <tr>
                <td align="center">
                    
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background:#198754; padding:30px;">
                                <h1 style="color:#ffffff; margin:0;">Backend Ledger</h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px 30px;">
                                <h2 style="color:#333333; margin-top:0;">Hello, ${name}! 🔐</h2>
                                <p style="color:#555555; font-size:16px; line-height:1.6;">
                                    We detected a successful login to your <strong>Backend Ledger</strong> account.
                                </p>

                                <p style="color:#555555; font-size:16px; line-height:1.6;">
                                    If this was you, you can safely ignore this email.
                                </p>

                                <p style="color:#d9534f; font-size:15px; font-weight:bold;">
                                    If you did not log in, please reset your password immediately to secure your account.
                                </p>

                                <!-- Button -->
                                <div style="text-align:center; margin:30px 0;">
                                    <a href="https://yourwebsite.com/reset-password" 
                                       style="background:#dc3545; color:#ffffff; padding:12px 25px; 
                                              text-decoration:none; border-radius:5px; 
                                              font-size:16px; display:inline-block;">
                                        Reset Password
                                    </a>
                                </div>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="background:#f1f1f1; padding:20px; font-size:13px; color:#888888;">
                                © ${new Date().getFullYear()} Backend Ledger. All rights reserved.
                                <br />
                                This is an automated security alert.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionEmail(userEmail, name, transactionDetails) {

    const subject = "Transaction Confirmation - Backend Ledger 📄";

    const text = `
Hello ${name},

We are pleased to inform you that your transaction has been successfully processed.

Transaction Details:
- Amount: ₹${transactionDetails.amount}
- From Account: ${transactionDetails.fromAccount}
- To Account: ${transactionDetails.toAccount}
- Status: ${transactionDetails.status}

If you have any questions, please contact our support team.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:30px;">
            <h2 style="color:#198754;">Transaction Successful ✅</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your transaction has been processed successfully.</p>

            <table width="100%" cellpadding="10" style="border-collapse:collapse;">
                <tr><td><strong>Amount:</strong></td><td>₹${transactionDetails.amount}</td></tr>
                <tr><td><strong>From Account:</strong></td><td>${transactionDetails.fromAccount}</td></tr>
                <tr><td><strong>To Account:</strong></td><td>${transactionDetails.toAccount}</td></tr>
                <tr><td><strong>Status:</strong></td><td style="color:green;"><strong>${transactionDetails.status}</strong></td></tr>
            </table>

            <p style="margin-top:20px;">Thank you for using Backend Ledger.</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}



async function sendTransactionFailureEmail(userEmail, name, transactionDetails) {

    const subject = "Transaction Failed - Backend Ledger ⚠️";

    const text = `
Hello ${name},

We regret to inform you that your transaction could not be completed.

Transaction Details:
- Amount: ₹${transactionDetails.amount}
- From Account: ${transactionDetails.fromAccount}
- To Account: ${transactionDetails.toAccount}
- Status: ${transactionDetails.status}

Please verify your account balance or try again later.

If the issue persists, contact support.

Best Regards,
Backend Ledger Team
`;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:30px;">
            <h2 style="color:#dc3545;">Transaction Failed ❌</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Unfortunately, your transaction could not be completed.</p>

            <table width="100%" cellpadding="10" style="border-collapse:collapse;">
                <tr><td><strong>Amount:</strong></td><td>₹${transactionDetails.amount}</td></tr>
                <tr><td><strong>From Account:</strong></td><td>${transactionDetails.fromAccount}</td></tr>
                <tr><td><strong>To Account:</strong></td><td>${transactionDetails.toAccount}</td></tr>
                <tr><td><strong>Status:</strong></td><td style="color:red;"><strong>${transactionDetails.status}</strong></td></tr>
            </table>

            <p style="margin-top:20px;">Please try again or contact support.</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendLoginEmail,
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};



