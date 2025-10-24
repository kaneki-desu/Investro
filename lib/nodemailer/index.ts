import nodemailer from 'nodemailer'
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './templates'
export const transporter= nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_PASSWORD
    }
})

export const sendWelcomeEmail = async({email, name, intro}: WelcomeEmailData) =>{
    const htmlTemplate= WELCOME_EMAIL_TEMPLATE
    .replace('{{name}}', name )
    .replace('{{intro}}', intro );

    const mailOptions ={
        from: `"Investro Team" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: 'Welcome to Investro! - your stock market toolkit is ready',
        text: 'Thanks for joining Investro',
        html: htmlTemplate
    }
    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async ({name, email,date,summary,}: {name:string,email: string;date: string;summary: string;}) => {
  // Assuming you have a separate HTML template for this
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
    .replace("{{date}}", date)
    .replace("{{newsContent}}", summary);

  const mailOptions = {
    from: `"Investro News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: ` Your Daily Stock Market News Summary - ${date}`,
    text: `Hi ${name},\n\nHere's your daily stock market summary:\n\n${summary}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};