const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { ObjectId } = require("mongodb");
const cloudinary = require('cloudinary').v2

require("dotenv").config();

const indexRouter = require("./routes/index");
const socialMediaAppRouter = require("./routes/socialMediaApp");

const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const initializePassport = require("./passportAuth");

// ✅ Mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Message = require("./models/messageModel"); // ✅ USE MONGOOSE MODEL

const mongoDB = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// ---------------- EXPRESS APP ----------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

// ---------------- MIDDLEWARE ----------------
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});

app.use(limiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

initializePassport();
app.use(session({
  secret: process.env.PASSPORT_PASSWORD,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------------- ROUTES ----------------
app.use("/", indexRouter);
app.use("/socialMediaApp", socialMediaAppRouter);

// ---------------- SOCKET.IO ----------------
io.on("connection", async (socket) => {
  console.log("a user connected");


  //added
  const { userID, userToMessage } = socket.handshake.auth;

  function getRoomId(userA, userB) {
    return [userA, userB].sort().join("-");
  }

  const roomId = getRoomId(userID, userToMessage);

  socket.join(roomId);

  console.log(`${userID} joined ${roomId}`);

//

 // const collectionId = socket.handshake.auth.collectionId;

//  socket.join(collectionId);

  // ---------------- SEND MESSAGE ----------------
  //recieved

  socket.on("chat message", async (msg, userID, userToMessage, clientOffset, callback) => {
    try {
      const message = await Message.create({
        author: userID,
        content: msg,
        roomId,
        client_offset: clientOffset,
        recipient: userToMessage
        //collection: collectionId,
      });
      

io.to(roomId).emit(
  "chat message",
  message.content,
  message.author,
  message.recipient,
  message._id.toString()
);


      if (typeof callback === "function") callback();

    } catch (err) {
      console.error(err);
    }
  });

  // ---------------- RECOVERY ----------------
  if (!socket.recovered) {
    try {
      const lastId = socket.handshake.auth.serverOffset;

      const query = lastId
        ? { _id: { $gt: new ObjectId(lastId) } }
        : {};

        function getRoomId(userA, userB) {
          return [userA, userB].sort().join("-");
        }

        const roomId = getRoomId(userID, userToMessage);

        const missedMessages = await Message.find({
          roomId,
          ...query
        }).sort({ _id: 1 });
      //sent
      for (const message of missedMessages) {

          const User = require("./models/userModel")
          let messageAuthor = await User.find({_id: message.author})
          console.log("messageAuthor", messageAuthor[0].username)
          let messageRecipient = await User.find({_id: message.recipient})
          console.log("messageRecipient", messageRecipient)
  
          function getRoomId(userA, userB) {
            return [userA, userB].sort().join("-");
          }
        
          const roomId = getRoomId(userID, userToMessage);
        
          socket.join(roomId);          
          io.to(roomId).emit(
            "chat message",
            message.content,
            messageAuthor[0].username,
            messageRecipient[0].username,
            message._id.toString(),
          );
        


      }

    } catch (err) {
      console.error(err);
    }
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
//cloudinary
cloudinary.config({ 
  cloud_name: 'dablidwxf', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});



/*
const url = cloudinary.url('testpic_kolmzs')
console.log(url)

;(async function () {
  const results = await cloudinary.uploader.upload('./uploads/testpic.jpg')
  console.log("results", results.public_id)
  const url = cloudinary.url(results.public_id)
  console.log("url", url)
})()
*/
// store file temporarily in memory (no disk needed)


// ---------------- ERROR HANDLING ----------------
app.use((err, req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// ---------------- SERVER START ----------------
const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", function () {
  console.log(`Server running on port ${port}`);
});

module.exports = app;