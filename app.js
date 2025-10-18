if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Import routers
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

// --------------------- MONGODB CONNECTION ---------------------
const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// --------------------- APP CONFIG ---------------------
app.set('trust proxy', 1);
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// --------------------- SESSION CONFIG ---------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET || 'thisshouldbeabettersecret' },
    touchAfter: 24 * 3600,
});

const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SECRET || 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

// --------------------- PASSPORT CONFIG ---------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------------------- FLASH & CURRENT USER ---------------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// --------------------- ROUTES ---------------------
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

// --------------------- HOME ROUTE ---------------------
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// --------------------- 404 HANDLER ---------------------
app.all('*', (req, res, next) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// --------------------- ERROR HANDLER ---------------------
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

// --------------------- SERVER START ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});