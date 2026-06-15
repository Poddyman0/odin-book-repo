const Post = require("../models/postModel")
const Comment = require("../models/commentModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require('cloudinary').v2


//Users should be able to sign in using your chosen authentication method.

//GET request to get a Profile by email
exports.user_get_email = asyncHandler(async (req, res, next) => {
    const aUser = await User.find({ email: req.params.email}).exec();

    if (!aUser) {
        res.json({
            profile: aUser,
            msg: "User get unsuccessfull as profile does not exist"
        })
    } else {
        res.json({
          profile: aUser,
          msg: "User get successfull"
        })
    }
  })

exports.user_sign_in_post_JWTBycrypt = [
    body("email", "email must be a valid email")
    .trim()
    .isEmail()
    .withMessage("email must be a valid email")
    .escape(),
    body("password", "password must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must contain at least 1 characters")
    .escape(),
    asyncHandler(async (req, res, next) => {


      const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
          msg: "errors",
        });
      }
    
      const userDB = await User.findOne({
        email: req.body.email
      }).exec();
      if (!userDB) {
        return res.json({ msg: "Incorrect email" });
      }
  
      const isMatch = bcrypt.compareSync(
        req.body.password,
        userDB.password
      );

      if (!isMatch) {
        return res.json({ msg: "Incorrect password" });
      }
    
      const token = jwt.sign(
        { userID: userDB._id },
        process.env.JWT_PASSWORD
      );
    
    
      res.json({
        user: userDB,
        userIDSignInCreated: userDB._id,
        msg: "JWT Auth Creation Passed",
        token: token,
      });
    
    })
    ]

exports.user_sign_out_post_passport = [
    asyncHandler(async (req, res, next) => {
        req.logout((err) => {
          if (err) {
            return next(err); // Passes any errors to the error handler
          }
        })
        res.json({
          msg: "Profile signed out successfully",
        });
      })
  ]

  exports.user_sign_in_post_passport = [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a valid email")
      .escape(),
  
    body("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("password must contain at least 1 characters")
      .escape(),
  
    asyncHandler(async (req, res, next) => {

      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
  
      next();
    }),
    // hashed password


    //
    (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
  
        if (!user) {
          return res.json({ msg: "Login failed" });
        }
  
        req.logIn(user, (err) => {
          if (err) return next(err);
  
          return res.json({
            msg: "Session login success",
            user,
          });
        });
  
      })(req, res, next); 
    }
  ];
  
//  Allow users to update their profile photo.
exports.user_profile_picture_update_post = [
  body("profilePictureURL", "profilePictureURL contain at least 1 characters")
  .trim()
  .isLength({ min: 1 })
  .withMessage("profilePictureURL must contain at least 1 characters")
  .escape(),

  asyncHandler(async (req, res, next) => {

            const errors = validationResult(req);
            const aUser = new User({
              profilePictureURL: req.body.profilePictureURL,
              _id: req.params.id,
          });
          if (!errors.isEmpty()) {
              res.json({
                  user: aUser,
                  errors: errors.array(),
                  msg: "errors",
              }) 
            } else {
              await User.findByIdAndUpdate(req.params.id, aUser, {});
              res.json({
                user: aUser,
                msg: "Profile Picture Updated Successfully",
              })
            } 
  })
]
  
exports.user_profile_picture_get = asyncHandler (async (req, res, next) => {
  const aUser = await User.findById(req.params.id).exec();
    let aUserCopy = {}
    aUserCopy.profilePictureURL = aUser.profilePictureURL
    if (!aUser) {
        res.json({
            user: aUserCopy,
            msg: "User get unsuccessfull as user does not exist"
        })
    } else {

        res.json({
            user: aUserCopy,
            msg: "User get successfull"
        })
    }
})

//A user’s profile page should contain their profile information, profile photo, and posts.
exports.user_get_id = asyncHandler(async (req, res, next) => {
  const aUser = await User.findById(req.params.id).exec();
  const userPosts = await Post.find({author: req.params.id}).exec()
  const allUsers = await User.find({}).exec()
  const allComments = await Comment.find({}).exec()
    let aUserCopy = {}
    aUserCopy.username = aUser.username;
    aUserCopy.profilePictureURL = aUser.profilePictureURL;
    aUserCopy.profileInfo = aUser.profileInfo;
    aUserCopy.followingRequests = []
    aUserCopy.followingAcceptance = []
    aUserCopy.followersRequest = []
    aUserCopy.followersAcceptance = []
    aUserCopy.userPosts = []

    aUser.followingRequests.forEach(followingReq => {
      allUsers.forEach(user => {
        if (`${user._id}` == `${followingReq}`) {
          let userCopy = {}
          userCopy._id = user._id
          userCopy.profilePictureURL = user.profilePictureURL
          userCopy.username = user.username
          aUserCopy.followingRequests.push(userCopy)
        }
      })
    })

    aUser.followingAcceptance.forEach(followingAc => {
      allUsers.forEach(user => {
        if (`${user._id}` == `${followingAc}`) {
          let userCopy = {}
          userCopy._id = user._id
          userCopy.profilePictureURL = user.profilePictureURL
          userCopy.username = user.username
          aUserCopy.followingAcceptance.push(userCopy)
        }
      })
    })

    aUser.followersRequest.forEach(followersReq => {
      allUsers.forEach(user => {
        if (`${user._id}` == `${followersReq}`) {
          let userCopy = {}
          userCopy._id = user._id
          userCopy.profilePictureURL = user.profilePictureURL
          userCopy.username = user.username
          aUserCopy.followersRequest.push(userCopy)
        }
      })
    })

    aUser.followersAcceptance.forEach(followersAcc => {
      allUsers.forEach(user => {
        if (`${user._id}` == `${followersAcc}`) {
          let userCopy = {}
          userCopy._id = user._id
          userCopy.profilePictureURL = user.profilePictureURL
          userCopy.username = user.username
          aUserCopy.followersAcceptance.push(userCopy)
        }
      })
    })

    /*
      _id: new ObjectId('6a145edd58fb91ac1aad94dc'),
  content: 'example post content 1',
  postImageURL: 'https://hips.hearstapps.com/hmg-prod/images/white-cat-breeds-kitten-in-grass-67bf648a54a3b.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
      author: new ObjectId('6a145edc58fb91ac1aad94c4'),
  likes: [
    new ObjectId('6a145edc58fb91ac1aad94c4'),
    new ObjectId('6a145edc58fb91ac1aad94c5'),
    new ObjectId('6a145edc58fb91ac1aad94c6')
  ],
  comments: [
    new ObjectId('6a145edc58fb91ac1aad94c4'),
    new ObjectId('6a145edc58fb91ac1aad94c5'),
    new ObjectId('6a145edc58fb91ac1aad94c6')
  ],
    */
    userPosts.forEach(post => {
      let aPostCopy = {}
      aPostCopy._id = post._id
      aPostCopy.user = {}
      aPostCopy.content = post.content,
      aPostCopy.postImageURL = post.postImageURL,
      aPostCopy.likes = [],
      aPostCopy.comments = []
      allUsers.forEach(user => {
        if (`${post.author}` == `${user._id}`) {
          aPostCopy.user.username = user.username
          aPostCopy.user.profilePictureURL = user.profilePictureURL

        }
      })
      post.likes.forEach(like => {
        allUsers.forEach(user => {
          if (`${like}` == `${user._id}`) {
            
            aPostCopy.likes.push(user.username)
          }
        })
      })
      //comments not showing
      allComments.forEach(comment1 => {
        post.comments.forEach(comment2 => {
            if (`${comment1._id}` == `${comment2}`) {
                let aCommentCopy = {}
                aCommentCopy.comment = comment1.comment,
                aCommentCopy.author = {}
                allUsers.forEach(user => {
                    if (`${user._id}` == `${comment1.author}`) {

                        aCommentCopy.author.username = user.username
                        aCommentCopy.author.profilePictureURL = user.profilePictureURL
                    }
                })
                aPostCopy.comments.push(aCommentCopy)
            }
        })
    })
      aUserCopy.userPosts.push(aPostCopy)
    })
    if (!aUser) {
        res.json({
            user: aUserCopy,
            msg: "User get unsuccessfull as user does not exist"
        })
    } else {

        res.json({
            user: aUserCopy,
            msg: "User get successfull"
        })
    }
})

//Users can create a profile with a profile picture
exports.user_create_post = [
  body("profilePictureURL", "profilePictureURL contain at least 1 characters")
  .trim()
  .isLength({ min: 1 })
  .withMessage("profilePictureURL must contain at least 1 characters")
  .escape(),
  body("profileInfo", "profileInfo contain at least 1 characters")
  .trim()
  .isLength({ min: 1 })
  .withMessage("profileInfo must contain at least 1 characters")
  .escape(),
  body("username", "username contain at least 1 characters")
  .trim()
  .isLength({ min: 1 })
  .withMessage("username must contain at least 1 characters")
  .escape(),
  body("email", "email contain at least 1 characters")
  .trim()
  .isEmail()
  .withMessage("email must contain at least 1 characters")
  .escape(),
  body("password", "password contain at least 1 characters")
  .trim()
  .isLength({ min: 1 })
  .withMessage("password must contain at least 1 characters")
  .escape(),
  body("followingRequests", "followingRequests must contain at least 1 characters")
  .trim()
  .isArray()
  .withMessage('followingRequests must have at least 1 character'),
  body("followingAcceptance", "followingAcceptance must contain at least 1 characters")
  .trim()
  .isArray()
  .withMessage('followingAcceptance must have at least 1 character'),  
  body("followingRequests", "followingRequests must contain at least 1 characters")
  .trim()
  .isArray()
  .withMessage('followingRequests must have at least 1 character'),  
  body("followersAcceptance", "followersAcceptance must contain at least 1 characters")
  .trim()
  .isArray()
  .withMessage('followersAcceptance must have at least 1 character'),

  asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            msg: "Validation errors occurred",
          });
        }
      
        const passwordToHash = req.body.password;
        try {
          const salt = bcrypt.genSaltSync(12);
          const hashedPassword = bcrypt.hashSync(passwordToHash, salt);
    
          const aUser = new User({
            profilePictureURL: req.body.profilePictureURL,
            profileInfo: req.body.profileInfo,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            followingRequests: req.body.followingRequests,
            followingAcceptance:  req.body.followingAcceptance,
            followersRequest: req.body.followersRequest,
            followersAcceptance: req.body.followersAcceptance
            
          });
    
          await aUser.save();
          res.json({
            userID: aUser._id,
            msg: "Profile Created Successfully",
          });
        } catch (err) {
          next(err);
        }
  })
]

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).exec();
  let allUsers = []
  let aUser = {}
  users.forEach(user => {
    aUser = {}
    aUser.username = user.username,
    aUser._id = user._id
    allUsers.push(aUser)
  })

  if (!users) {
      res.json({
          users: allUsers,
          msg: "Users get unsuccessfull as user does not exist"
      })
  } else {
    if (allUsers.length === users.length) {
      res.json({
        users: allUsers,
        msg: "Users get successfull"
    })
    }

  }
})

//POST request to update a users following requests and send follower request to another user,

exports.user_update_post = [
  body("followingRequest")
  .isLength({ min: 1 })
    .withMessage("followingRequest must be an array"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const aUser = await User.findById(req.params.id).exec();
    aUser.followingRequests.push(req.body.followingRequest);
    await aUser.save();
    //returning undefined


      const aFollower = await User.findById(req.body.followingRequest).exec();
      aFollower.followersRequest.push(req.params.id);
      await aFollower.save();


    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        msg: "errors",
      });
    } else {
      res.json({
        msg: "User Following Request Updated Successfully",
      });
    }


  })
];
// follow requests to users the user is not already following or have a pending request.
exports.users_get_follow_request = asyncHandler(async (req, res, next) => {
  const aUserDB = await User.findById(req.params.id).exec()
  const users = await User.find({}).exec();
  
  // IDs user should NOT see
  const excludedUsers = [

    req.params.id, // themselves

    ...aUserDB.followingRequests.map(id => `${id}`),

    ...aUserDB.followingAcceptance.map(id => `${id}`)

  ];

  // Only users eligible for follow requests
  const allUsers = users
    .filter(user => !excludedUsers.includes(`${user._id}`))
    .map(user => ({
      profilePictureURL: user.profilePictureURL,
      username: user.username,
      _id: user._id
    }));




  if (!users) {
      res.json({
          users: allUsers,
          msg: "Users get unsuccessfull as user does not exist"
      })
  } else {
      res.json({
        users: allUsers,
        msg: "Users get successfull"
    })
    

  }
})

//upload images with cloudindry


exports.user_image_upload_update = asyncHandler(async (req, res) => {
  const aUser = await User.findById(req.params.id);

  console.log("before", aUser);

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("result", result)
    aUser.profilePictureURL = result.secure_url;

    await aUser.save(); // IMPORTANT

    fs.unlinkSync(req.file.path);

    console.log("after", aUser);

    return res.json({
      user: aUser,
      msg: "upload successful",
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      msg: "upload failed",
      error: err.message,
    });
  }
});