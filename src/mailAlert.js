require('dotenv').config();

const nodemailer = require('nodemailer');

const sendAlert = async (doctorsEmail, patientName) => {
  const prom = new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${doctorsEmail}`,
      subject: 'Patient at Risk Alert!',
      text: `Our system has detected that patient by the name of ${patientName} is currently at risk.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(`Alert sent: ${info.response}`);
        resolve('Alert sent');
      }
    });
  });

  return prom;
};

module.exports = { sendAlert };
