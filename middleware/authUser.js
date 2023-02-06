const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {

  const token = req.header('authToken');
  if (!token) {
    res.status(401).json({
      message: "Please authenticate using a valid token",
      error: true
    })
  }
  try {
    const data = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.data = data;
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
      error: true
    });

  }
}

module.exports = authUser;