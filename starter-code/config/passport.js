const passport = require("passport");
const User = require("../models/User");
const googleStrategy = require("passport-google-oauth20").Strategy;

passport.use(User.createStrategy());

passport.serializeUser( (user, done) =>{
    done(null, user.id)
})

passport.deserializeUser((id,done) =>{
    User.findById(id, (err, user) => {
        done(err, user);
    })
});



//Estrategia de pase para google


passport.use(new googleStrategy(
    {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback"
    },
    async (_, __, profile, done) => {
       //console.log("Profile:", profile);
        const user = await User.findOne({
            googleID: profile.id
        })

        if (user) {
            //user.image = profile._json.picture;
            await user.save();
            return done(null, user);
        }
        const newUser = await User.create({
            googleID: profile.id,
            name: profile.displayName,
            email: profile._json.email,
           // image: profile._json.picture
        });
        done(null, newUser);

        }
    )
)

module.exports = passport;
