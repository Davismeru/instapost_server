const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    res.json({ error: "please login first" });
  } else {
    try {
      const validToken = verify(accessToken, "security_key");
      req.user = validToken;
      if (validToken) {
        return next();
      }
    } catch (err) {
      return res.json({ error: err });
    }
  }
};

module.exports = validateToken;
