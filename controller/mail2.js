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

export async function sendEmail2(name, email, paymentId, moon) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: `${name} : 문의사항이 있습니다`, // Subject line
      html:
        `<p>이름 : ${name}</p>` +
        `<p>이메일 : ${email}</p>` +
        `<p>주문번호 : ${paymentId}</p>` +
        `<span>문의내용 : ${moon}</span>`,
    });
    console.log("eamil send: ", email);
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
  try {
    const info2 = await transporter.sendMail({
      from: `Star Spray <${process.env.EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: `문의사항이 접수되었습니다`, // Subject line
      html:
        `<p>안녕하세요 ${name} 고객님</p>` +
        `<br />` +
        `<p>고객님의 문의사항이 접수되었습니다.</p>` +
        `<p>빠른 시일 내에 담당자가 내용 확인 후 답변드리겠습니다.</p>` +
        `<p>감사합니다.</p>`,
    });
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}
