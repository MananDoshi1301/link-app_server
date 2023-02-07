const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {

  const tokenString = req.header('authorization');
  const token = tokenString && tokenString.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Please authenticate using a valid token",
      error: true
    })
  }
  try {
    const data = jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
      if (err) {
        res.status(403).json({
          message: "Please authenticate using a valid token",
          error: true
        })
      }
      req.user = user;
    });
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