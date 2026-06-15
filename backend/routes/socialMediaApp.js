const express = require('express');
const router = express.Router();
const jwtAuth = require('../jwtAuth')
const comment_controller = require("../controllers/commentController");
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController")
const passport = require("passport");
const upload = require("../multerCloudindry");



//Users should be able to sign in using your chosen authentication method.
router.post(
    `/user/put/signin/:id`,
    passport.authenticate("local", {
      successRedirect: `/user/get/:id/auserID`,
      failureRedirect: `/user/put/signin/:id`
    })
  );

//done
// GET request to get a user by email
router.get("/user/get/auserEmail/:email",
user_controller.user_get_email
)


// POST JWT / Bycrypt  request to login user and return token
router.post("/user/put/signin/:id/JWTBycrypt", 
user_controller.user_sign_in_post_JWTBycrypt
);

// POST passport request to update and sign out of  a user.
router.post("/user/put/signout/:id/passport", jwtAuth,
user_controller.user_sign_out_post_passport
)

// POST passport request to login user
router.post("/user/put/signin/:id/passport", jwtAuth,
user_controller.user_sign_in_post_passport
);




//  Allow users to update their profile photo.
router.post("/user/put/:id/userprofilepictureupdate", jwtAuth, upload.single("image"),
user_controller.user_profile_picture_update_post
);

// Allow users to get their profile photo.
router.get("/user/get/:id/userprofilepictureget", jwtAuth,
user_controller.user_profile_picture_get
);

//A user’s profile page should contain their profile information, profile photo, and posts.
router.get("/user/get/:id/getuserandposts", jwtAuth, 
user_controller.user_get_id
)

//Users can create a profile with a profile picture
router.post("/user/post", 
user_controller.user_create_post
)

//GET request to get all users
router.get("/users/get", jwtAuth, 
user_controller.users_get
)

//POST request to update a users following requests and send follower request to another user,
router.post("/user/put/:id/userfollingupdate", jwtAuth,
user_controller.user_update_post
);

// follow requests to users the user is not already following or have a pending request.
router.get("/users/get/:id/followrequest", jwtAuth, 
user_controller.users_get_follow_request
)

  //Users can create posts
// POST request to create a post.
router.post("/post/post", jwtAuth, 
post_controller.post_create_post
)

//GET: There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
router.get("/post/get/posts/:id", jwtAuth, 
post_controller.post_get_by_userID_and_following
)

//POST: Users can like posts.
router.post("/post/post/:id/likepost", jwtAuth, 
post_controller.post_post_likepost
)

//POST: Users can comment on posts.

router.post("/post/post/:id/usercommentpost", jwtAuth, 
post_controller.post_post_usercommentpost
)

//POST: users can upload pictures to cloudindry.
router.post("/user/put/:id/profileimageupload", jwtAuth, upload.single("image"),
user_controller.user_image_upload_update
)

//POST: users can upload pictures to cloudindry.
router.post("/post/post/:id/postimageupload", jwtAuth, upload.single("image"),
post_controller.post_image_upload_create
)








module.exports = router;