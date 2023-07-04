const myJwt = require("../services/JwtService");

module.exports = async function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(400).json({ message: "OTP has not registered yet..." });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "OTP has not registered yet (Token is not given)" });
    }

    const [error, decodedToken] = await to(myJwt.verifyAccess(token));
    if (error) {
      return res.status(403).json({ message: error.message });
    }

    console.log(decodedToken);
    next();
  } catch (error) {
    res.status(500).json({ message: "Token is incorrect" });
  }
};

async function to(promise) {
  return promise
    .then((response) => [null, response])
    .catch((error) => {
      error;
    });
}
