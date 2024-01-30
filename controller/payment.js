import axios from "axios";
import dotenv from "dotenv";
import * as paymentRepository from "../data/payment.js";
import * as authRepository from "../data/auth.js";
dotenv.config();

export async function newOrder(req, res) {
  const order = req.body;
  const id = await paymentRepository.newOrder(order);
  if (!id)
    return res.status(400).json({ message: "결제 진행에 문제가 발생했습니다" });
  res.sendStatus(200);
}

export async function complete(req, res) {
  try {
    // 요청의 body로 SDK의 응답 중 paymentId가 오기를 기대합니다.
    const { paymentId } = req.body;
    // 1. 포트원 API를 사용하기 위해 액세스 토큰을 발급받습니다.
    const signinResponse = await axios({
      url: "https://api.portone.io/login/api-secret",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        apiSecret: process.env.PORTONE_API_SECRET, // 포트원 API Secret
      },
    });
    const { accessToken } = signinResponse.data;
    // 2. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await axios({
      url: `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      method: "get",
      // 1번에서 발급받은 액세스 토큰을 Bearer 형식에 맞게 넣어주세요.
      headers: { Authorization: "Bearer " + accessToken },
    });
    const { id, status, amount, method } = paymentResponse.data;
    // 3. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액을 비교합니다.
    const order = await paymentRepository.getOrder(id);
    if (order.total === amount.total) {
      switch (status) {
        case "VIRTUAL_ACCOUNT_ISSUED": {
          // 가상 계좌가 발급된 상태입니다.
          // method에 들어 있는 계좌 정보를 이용해 원하는 로직을 구성하세요.
          break;
        }
        case "PAID": {
          await paymentRepository.orderComplete(id);
          return res.sendStatus(200);
        }
      }
    } else {
      console.warn("위변조 감지 ", order);
      return res
        .status(400)
        .json({ message: "결제금액 위변조가 감지되었습니다" });
    }
  } catch (error) {
    // 결제 검증에 실패했습니다.
    res.status(400).send({ message: "결제 검증에 문제가 발생했습니다" });
  }
}
