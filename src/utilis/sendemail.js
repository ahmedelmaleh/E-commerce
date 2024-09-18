import nodemailer from 'nodemailer'
export const sendEmail=async({to,subject,html})=>{
    const transporter = nodemailer.createTransport({
    service:'gmail',
     auth: {
        user: "almalehahmed@gmail.com",
        pass: "lqtu pxwd hllm dvim",
  },
});
const info = await transporter.sendMail({
    from: '"breadfast " <almalehahmed@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
}
