const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


// Render the home page
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      // Query configuration
      // From the Post table, include the post ID, URL, title, and the timestamp from post creation
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      // Order the posts from most recent to least
      order: [[ 'created_at', 'DESC']],
      // From the User table, include the post creator's user name
      // From the Comment table, include all comments
      include: [
        {
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }
      ]
  })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // create an array for the posts, using the get method to trim extra sequelize object data out
    const posts = dbPostData.map(post => post.get({ plain: true }));
    // pass the posts into the homepage template
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Render the single post page
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        // specify the post id parameter in the query
        id: req.params.id
      },
      // Query configuration, as with the get all posts route
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }
      ]
    })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // serialize the post data, removing extra sequelize meta data
    const post = dbPostData.get({ plain: true });
    // pass the posts and a session variable into the single post template
    res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
    });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Render the login page.  If the user is logged in, redirect to the home page.
router.get('/login' , async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('login');
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }       
});

// Render the sign up page.  If the user is logged in, redirect to the home page.
router.get('/signup' , async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }       
});

module.exports = router;