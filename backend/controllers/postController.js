const Post = require("../models/postModel")
const Comment = require("../models/commentModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2
const fs = require("fs");


exports.post_create_post= [
    body("content", "content must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('content must have at least 1 character'),

    body("author", "author must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('author must have at least 1 character'), 
    body("likes", "likes must contain at least 1 characters")
        .isArray().withMessage('likes must have at least 1 character'),   
    body("comments", "comments must contain at least 1 characters")
        .isArray().withMessage('comments must have at least 1 character'), 
    asyncHandler(async (req, res, next) => {
        const aPost = new Post({
            content: req.body.content,
            postImageURL: "",
            author: req.body.author,
            likes: req.body.likes,
            comments: req.body.comments,
          });
          console.log("aPost", aPost)
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.json({
                post: aPost,
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            await aPost.save();
            res.json({
                post: aPost,
                msg: "Post Created Successfully",
            })
          } 
    })
]

exports.post_get_by_userID_and_following = asyncHandler(async (req, res, next) => {
    const aUser = await User.findById(req.params.id).exec();
    const userPosts = await Post.find({author: req.params.id}).exec()
    
    const allPosts = await Post.find({}).exec()
    const allComments = await Comment.find({}).exec()
    const allUsers = await User.find({}).exec()

    let allUserAndFollowingPosts = []
    //posts for recent posts from the current user 
    userPosts.forEach(post => {
        let postCopy = {}
        postCopy._id = post._id
        postCopy.content = post.content,
        postCopy.postImargeURL = post.postImageURL,
        postCopy.author = {},
        postCopy.likes = [],
        postCopy.comments = []
        allUsers.forEach(user => {
            if (`${user._id}` == `${post.author}`) {
                postCopy.author.username = user.username
                postCopy.author.profilePictureURL = user.profilePictureURL
            }
        })
        allUsers.forEach(user => {
            post.likes.forEach(like => {
                if (`${user._id}` == `${like}`) {
                    let userCopy = {}
                    userCopy.username = user.username,
                    userCopy.profilePictureURL = user.profilePictureURL
                    postCopy.likes.push(userCopy)
                }
            })
        })
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
                    postCopy.comments.push(aCommentCopy)
                }
            })
        })


        allUserAndFollowingPosts.push(postCopy)
    })

    // post from users theyre following
    aUser.followingAcceptance.forEach(follow => {
        allPosts.forEach(post => {            
            if (`${post.author}` == `${follow}`) {

                let postCopy = {}
                postCopy._id = post._id

                postCopy.content = post.content,
                postCopy.postImargeURL = post.postImageURL,
                postCopy.author = "",
                postCopy.likes = [],
                postCopy.comments = []
                allUsers.forEach(user => {
                    if (`${user._id}` == `${post.author}`) {
                        postCopy.author.username = user.username
                        postCopy.author.profilePictureURL = user.profilePictureURL                    }
                })
                allUsers.forEach(user => {
                    post.likes.forEach(like => {
                        if (`${user._id}` == `${like}`) {
                            let userCopy = {}
                            userCopy.username = user.username,
                            userCopy.profilePictureURL = user.profilePictureURL
                            postCopy.likes.push(userCopy)                        }
                    })
                })
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
                            postCopy.comments.push(aCommentCopy)
                        }
                    })
                })


                allUserAndFollowingPosts.push(postCopy)

            }
        })
    })
   
    if (!aUser) {
        res.json({
            posts: allUserAndFollowingPosts,
            msg: "Posts get unsuccessfull as user does not exist"
        })
    } else if (userPosts.length === 0) {
        res.json({
            posts: allUserAndFollowingPosts,
            msg: "Posts get unsuccessfull as author does not exist"
        })
    } else {
        res.json({
            posts: allUserAndFollowingPosts,
            msg: "Posts get successfull"
        })
    }
})

exports.post_post_likepost = [
    body("userID", "userID must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('userID must have at least 1 character'),
    asyncHandler(async (req, res, next) => {
          const errors = validationResult(req);
          const aPost = await Post.findById(req.params.id).exec();
          aPost.likes.push(req.body.userID)
            

          if (!errors.isEmpty()) {
            res.json({
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            await aPost.save();
            res.json({
                post: aPost,
                msg: "Post Liked Successfully",
            })
          } 
    })
]
//POST: Users can comment on posts.

exports.post_post_usercommentpost = [
    body("author", "author must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('author must have at least 1 character'),
    body("comment", "comment must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('comment must have at least 1 character'),
    asyncHandler(async (req, res, next) => {
          const errors = validationResult(req);
            const aComment = new Comment({
                comment: req.body.comment,
                author: req.body.author
            })
            await aComment.save()

          const aPost = await Post.findById(req.params.id).exec();
          aPost.comments.push(aComment._id)
          await aPost.save();

          if (!errors.isEmpty()) {
            res.json({
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            res.json({
                post: aPost,
                msg: "Post Liked Successfully",
            })
          } 
    })
]

exports.post_image_upload_create = asyncHandler(async (req, res) => {
    const aPost = await Post.findById(req.params.id);
  
    console.log("before", aPost);
  
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("result", result)
      aPost.postImageURL = result.secure_url;
  
      await aPost.save(); // IMPORTANT
  
      fs.unlinkSync(req.file.path);
  
      console.log("after", aPost);
  
      return res.json({
        post: aPost,
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