require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8000;
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

mongoose.connect(process.env.MONGO_URL).then(e => console.log('Db connected'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));
app.use('/user', userRoute);
app.use('/blog', blogRoute);



app.get('/', async (req, res) => {
    const allblogs = await Blog.find({});
    res.render('home', { user: req.user, blogs: allblogs, });
});
// Due search
app.get('/search', async (req, res) => {
    const {title} = req.query;
    const allblogs = await Blog.find({ 'title': title });
    res.json(allblogs);
}); 


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
});