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
      from: "Foo from @bar.com <donotreply@bar.com>", // sender address
      to: "sakao0517@naver.com", // list of receivers
      subject: `${name} : 문의사항 있음`, // Subject line
      html:
        `<p>이름 : ${name}</p>` +
        `<p>이메일 : ${email}</p>` +
        `<p>주문번호 : ${paymentId}</p>` +
        `<spap>문의내용 : ${moon}</span>`,
    });
    console.log("문의 이메일 발송 ", email);
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
  try {
    const info2 = await transporter.sendMail({
      from: "Foo from @bar.com <donotreply@bar.com>", // sender address
      to: email, // list of receivers
      subject: `[이카리]문의사항이 접수되었습니다`, // Subject line
      html: `안녕하세요 ${name} 고객님`,
    });
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}
