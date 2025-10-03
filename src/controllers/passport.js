const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/usersSchema"); 

//  Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BE_URL}api/social-login/facebook/callback`, // ✅ backend URL
      profileFields: ["id", "emails", "name", "displayName", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔎 Facebook profile:", profile);
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await User.findOne({
          where: { providerId: profile.id, provider: "facebook" },
        });

        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName || profile.displayName || "Facebook",
            lastName: profile.name?.familyName || "",
            email,
            profile: profile.photos?.[0]?.value || null,
            provider: "facebook",
            providerId: profile.id,
          });
          console.log("✅ Facebook user created:", user.email);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

//  Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BE_URL}api/social-login/google/callback`, // ✅ backend URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email,
            profilePic: profile.photos?.[0]?.value || null,
            provider: "google",
            providerId: profile.id,
          });
          console.log("✅ Google user created:", user.email);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


//  Serialize & Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
