import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const csrfCheck = (req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    return next();
  }

  const csrfHeader = req.get("startoken");
  if (!csrfHeader) {
    console.warn("누가 csrf-token 없이 접속 시도했다...", req.headers.origin);
    return res.status(403).json({ message: "Failed CSRF check1" });
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          "누가 csrf-token은 있지만 검증에 실패함...",
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check2" });
      }
      next();
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "something went wrong" });
    });
};

async function validateCsrfToken(csrfHeader) {
  const csrfKey = String(process.env.CSRF_SECRET_KEY);
  return bcrypt.compare(csrfKey, csrfHeader);
}
