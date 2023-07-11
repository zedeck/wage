require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const app = express();
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const { hashData } = require("../utilities/hashData");
const { validateSignUp } = require("../utilities/validateSignUp");
const { validateSignIn } = require("../utilities/validateSignIn");


app.use(express.json());

// SignUp
app.post("/signup", async (req, res) => {

  try {
    // Get user input
    let { first_name, last_name, email, password } = req.body;
    // Validate user input
    if (!(await validateSignUp(first_name, last_name, email, password, res))) {
      return res.statusMessage;
    } else {

      console.log("User Validated OK!");
      // Check if user already exist in database
      let oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(409).send("User already exist.");
      } else {

        console.log("User Not in DataBase");
        //Encrypt user password
        const hashedData = await hashData(password);

        // Create user in database
        try {

          const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), //convert email to lowercase
            password: hashedData,

          });
          console.log("User Craeated in DataBase");
          // Create token
          try {
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "0.083h",
              }
            );
            // save user token
            user.token = token;
            console.log("Token Created");
          } catch (error) {
            return res.status(409).send("Error creating token.");
          }
          // return new user
          res.status(201).json(user);

        } catch (error) {
          // throw Error("Error encrypting password.")
          return res.status(409).send("Error creating user in database.");
        }

      }
    }
  } catch (err) {
    console.log(err);
  }


});

// Sign In
app.post("/signin", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(await validateSignIn(email, password, res))) {
      return res.statusMessage;
    } else {

      console.log("User Validated OK!");
      // Validate if user exist in database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "0.083h",
          }
        );

        // save user token
        user.token = token;
        console.log("Token Created");
        res.status(200).json(user); 
      }else{
        res.status(400).send("Signin failed."); 
      }
      // user
      
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = app;