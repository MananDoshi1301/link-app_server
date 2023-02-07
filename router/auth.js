require('../db/conn');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const Links = require('../models/linkSchema');

const authUser = require('../middleware/authUser');

const router = express.Router();


router.get('/', (req, res) => {
  res.send("Hello from server in route!");
})

const print = (content) => {
  console.log(content);
}

// signin  (/signin)
// signup  (/signup)
// addlink (/link-page/add-link)
// getlink (/link-page/${details.id})
// dellink (/link-page/delete-link)

// Using promises

// router.post('/signup', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(422).json({ error: "Plz fill all fields!" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exists!" });
//       }

//       const user = new User({ email, password });

//       user.save().then(() => {
//         res.status(201).json({ message: "User registered succesfully!" });
//       }).catch((err) => res.status(501).json({ error: err }));
//     }).catch(err => console.log(err));
// });

// router.post('/signin', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(422).json({ error: "Plz fill all fields!" });
//   }

//   User.findOne({ email: email });
// });

router.post('/signup', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Please fill all fields!" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ message: "Email already exists!" });
    }
    else {
      const user = new User({ email, password });
      const savedUser = await user.save();
      if (savedUser) res.status(201).json({ message: "User registered succesfully!" });
    }

  }
  catch (err) {
    console.log(err)
  }

});

router.post('/signin', async (req, res) => {

  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "Please fill all fields!", error: true });
    }

    const userExist = await User.findOne({ email: email });
    // console.log(userExist._id);
    if (!userExist) {
      res.status(400).json({ message: "Please enter correct user credentials", error: true });
    }
    else {
      const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
      if (isPasswordCorrect == false) res.json({ message: "Incorrect username or password", error: true });
      else {
        const resData = {
          userid: userExist._id
        }

        const jwtAuthToken = jwt.sign(resData, process.env.JWT_ACCESS_TOKEN);
        // res.json({ message: "User signed in succesfully!", id: userExist._id, error: false });
        res.json({ message: "User signed in succesfully!", authToken: jwtAuthToken, error: false });
      }
    }

  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
});

// Optimised with jwt auth
router.post('/link-page/delete-link', authUser, async (req, res) => {

  const userid = req.user.userid;
  try {
    const { linkId } = req.body;

    if (!userid) return res.status(422).json({ message: "Cannot retrieve user id!", error: true });

    if (!linkId) return res.status(422).json({ message: "Invalid LinkId!", error: true });

    const linkDelete = await Links.updateOne({ userid: userid }, {
      $pull: {
        links: {
          "_id": linkId
        }
      }
    })

    if (linkDelete.modifiedCount === 1 && linkDelete.matchedCount === 1)
      res.status(201).json({ message: "Link Deleted Succesfully", error: false });
    else {

    }
  } catch (error) {
    console.log(error);
  }
})

// Old method with params and no jwt
router.get('/link-page/:id', authUser, async (req, res) => {
  // console.log(req.params)

  try {
    const data = await Links.find({ userid: req.params.id });
    // res.json(data);
    // console.log(req.params.id);
    if (data.length === 0) {
      res.status(404).json({
        message: "User does not exist",
        error: true
      })
    }
    else {
      res.json({
        message: "success",
        error: false,
        data: data[0].links
      })
    }
  } catch (err) {
    console.log(err);
  }
  // res.json({ message: 'done' })
})

// New token based get link getrequest
router.get('/link-page/', authUser, async (req, res) => {

  const userid = req.user.userid;
  try {
    const data = await Links.find({ userid });
    // res.json(data);    
    if (data.length === 0) {
      res.status(404).json({
        message: "User does not exist",
        error: true
      })
    }
    else {
      res.json({
        message: "success",
        error: false,
        data: data[0].links
      })
    }
  } catch (err) {
    console.log(err);
  }
  // res.json({ message: 'done' })
})

// Optimised with jwt token
router.post('/link-page/add-link', authUser, async (req, res) => {

  const userid = req.user.userid;
  try {
    const { links } = req.body;
    const { title, url, isValidUrl } = links;
    // console.log(userid, title, url)
    if (!userid || !title || !url) {
      return res.status(422).json({
        error: true, message: "Please fill all details",
      });
    }

    const doesUserDocExist = await Links.find({ userid: userid });
    // res.json({ id: userid })

    if (doesUserDocExist.length == 0) {
      // print("Adding new doc")
      const linkDoc = new Links({ userid, links: [{ title, url, isValidUrl }] });
      // const savedDoc = await linkDoc.save();

      if (savedDoc) res.status(201).json({
        message: "Link added succesfully", error: false
      })
    }
    else {
      // print("Updating doc")
      const savedDoc = await Links.findOneAndUpdate({
        userid: userid
      }, {
        $push: {
          links: { title, url, isValidUrl },
        }
      })

      if (savedDoc) res.status(201).json({
        message: "Link saved succesfully", error: false
      })
    }


  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;