import dotenv from "dotenv";
import { createTransport } from "nodemailer";
dotenv.config();

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: String(process.env.EMAIL),
    pass: String(process.env.EMAIL_PASSWORD),
  },
});

export async function sendEmail(email, token) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: `"👻" <${String(process.env.EMAIL)}>`, // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      html:
        "<p>비밀번호 초기화를 위해 아래의 URL을 클릭하여 주세요.</p>" +
        `<a href="http://localhost:3000/settingPassword/${token}">비밀번호 재설정 링크</a>`,
    });
    console.log("Password reset email sent: ", info.accepted[0]);
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}
