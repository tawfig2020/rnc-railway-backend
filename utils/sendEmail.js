const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options (to, subject, text, html)
 * @returns {Promise} - Resolves if email is sent, rejects if there's an error
 */
const sendEmail = async (options) => {
  // Create a test account if we're in development mode and no SMTP settings are provided
  let testAccount = null;
  let transporter;

  try {
    if (!config.smtp.host || config.smtp.host === 'smtp.example.com') {
      console.log('No SMTP settings provided. Using Ethereal test email account...');
      try {
        // Create test account for development
        testAccount = await nodemailer.createTestAccount();
        
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        console.log('Using Ethereal test email account:', testAccount.user);
      } catch (etherealError) {
        console.error('Could not create Ethereal test account:', etherealError.message);
        console.log('Falling back to fake email transport that just logs messages');
        
        // Create a fake transport that just logs messages but doesn't actually send
        transporter = {
          sendMail: (message) => {
            console.log('\n---------- EMAIL WOULD HAVE BEEN SENT ----------');
            console.log('To: ' + message.to);
            console.log('Subject: ' + message.subject);
            console.log('Content: ' + (message.html || message.text));
            console.log('----------------------------------------------\n');
            
            return Promise.resolve({ 
              messageId: 'fake-message-id-' + Date.now(),
              fake: true
            });
          }
        };
      }
    } else {
      // Use configured SMTP settings
      console.log(`Configuring email with SMTP host: ${config.smtp.host}`);
      transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.password
        }
      });
    }

    // Email content
    const message = {
      from: `${config.fromName} <${config.fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text
    };

    // Send email
    const info = await transporter.sendMail(message);
    
    console.log('Email sent: %s', info.messageId);
    
    // Log URL for development preview
    if (testAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else if (info.fake) {
      console.log('Note: This was a simulated email, not actually sent');
      console.log('To test a real email service, set up SMTP settings in .env file');
    }
    
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

module.exports = sendEmail;
