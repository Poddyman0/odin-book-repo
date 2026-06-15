#! /usr/bin/env node

console.log(
    'This script populates some test comment, post and users into the database.'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/userModel");
  const Comment = require("./models/commentModel");
  const Post = require("./models/postModel");
  
  const users = [];
  const comments = [];
  const posts = []
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createComments()
    await createPosts();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  

  async function userCreate(index, profilePictureURL, profileInfo, username, email, password, followingRequests, followingAcceptance, followersRequest, followersAcceptance) {
    const user = new User({ 
      profilePictureURL: profilePictureURL,
      profileInfo: profileInfo,
      username: username,
      email: email,
      password: password,
      followingRequests: followingRequests,
      followingAcceptance: followingAcceptance,
      followersRequest: followersRequest,
      followersAcceptance: followersAcceptance
    });
    await user.save();
    users[index] = user;
    console.log(`Added user with email: ${email}`);
  }

  //here
  async function commentCreate(index, commentText, author) {
    const comment = new Comment ({ 
        comment: commentText,
        author: author,
    })

    await comment.save();
    comments[index] = comment;
    console.log(`Added comment with author: ${author}`);
  }
  
  async function postCreate(index, content, postImageURL, author, likes, comments) {
    const post = new Post ({ 
      content: content,
      postImageURL: postImageURL,
      author: author,
      likes: likes,
      comments: comments
      
    })

    await post.save();
    posts[index] = post;
    console.log(`Added post with author: ${author}`);
  }


  //check if dates are right
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
      userCreate(0, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s", "example profile info 1", "username 1", "example1@domain.com", "password1", [], [], [], []),
      userCreate(1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC8kiSH5ZSAcVoj3tAQQDoP_ux0sSricMyUg&s", "example profile info 2", "username 2", "example2@domain.com", "password2", [], [], [], []),
      userCreate(2, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN3-b6hE_5K-l4bv_gBuFtF5zWoPEhSkLsuw&s", "example profile info 3", "username 3", "example3@domain.com", "password3", [], [], [], []),
      userCreate(3, "https://fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_11368.png", "example profile info 4", "username 4", "example4@domain.com", "password4", [], [], [], []),
      userCreate(4, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3i_qZtrjSgoPCyIOywhlX8MKOzRIaQbKU0A&s", "example profile info 5", "username 5", "example5@domain.com", "password5", [], [], [], []),
      userCreate(5, "https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Sami-Viitama%CC%88ki--300x300.jpeg", "example profile info 6", "username 6", "example6@domain.com", "password6", [], [], [], []),

    ]);
  }

  async function createComments() {
    console.log("Adding comments");
    await Promise.all([
        commentCreate(0, "comment example 1", users[0]),
        commentCreate(1, "comment example 2", users[1]),
        commentCreate(2, "comment example 3", users[2]),
        commentCreate(3, "comment example 4", users[3]),
        commentCreate(4, "comment example 5", users[4]),
        commentCreate(5, "comment example 6", users[5]),

    ]);
  }
  
  async function createPosts() {
    console.log("Adding posts");
    await Promise.all([
        postCreate(0, "example post content 1", "https://hips.hearstapps.com/hmg-prod/images/white-cat-breeds-kitten-in-grass-67bf648a54a3b.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*", users[0], [users[0], users[1], users[2]], [comments[0], comments[1], comments[2]]), 
        postCreate(1, "example post content 2", "https://hips.hearstapps.com/hmg-prod/images/white-cat-breeds-kitten-in-grass-67bf648a54a3b.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*", users[5], [users[3], users[4], users[5]], [comments[3], comments[4], comments[5]])
    ]);
  }

 