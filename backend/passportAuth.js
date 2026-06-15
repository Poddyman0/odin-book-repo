// config/passportAuth.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

function initializePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },

      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, {
              message: "Incorrect email",
            });
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordMatch) {
            return done(null, false, {
              message: "Incorrect password",
            });
          }

          return done(null, user);

        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initializePassport;
/*


  //below needed? 
  app.use((req, res, next) => {
    res.locals.currentUser = req.profile;
    next();
  });

  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

//in profileController

// GET request to login a user.
exports.user_login_get = (req, res) => {
    res.render("user_login", {user: res.locals.currentUser});
}

*/






