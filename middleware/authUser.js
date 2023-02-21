const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {

  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({
      message: "Please authenticate using a valid token",
      error: true
    })
  }
  try {
    const baseToken = token.split(" ")[1]
    const data = jwt.verify(baseToken, process.env.JWT_ACCESS_TOKEN);
    req.data = data;
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
      error: true
    });
    // next()
  }
}

module.exports = authUser;