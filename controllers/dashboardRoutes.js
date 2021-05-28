// Dependencies
// the router and the database
const router = require('express').Router();
const sequelize = require('../config/connection');
// the models
const { Post, User, Comment } = require('../models');
// the authorization middleware to redirect unauthenticated users to the login page
const withAuth = require('../utils/auth')

// A route to render the dashboard page, only for a logged in user
router.get('/',  withAuth, async  (req, res) => {
  try {
      // create method
  // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    const dbPostData = await Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
   
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('dashboard', { posts, loggedIn: true });
    
  
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// A route to edit a post
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
      // create method
  // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // serialize data before passing to template
    const post = dbPostData.get({ plain: true });
    res.render('edit-post', { post, loggedIn: true });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT /api/users/1 -- update an existing user
router.get('/edituser',withAuth, async (req, res) => {
  try {
    // update method
    // expects {username: 'brandonuser', email: 'brandon@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, 
    // you can just use `req.body` instead of calling out each property,
    // allowing for updating only key/value pairs that are passed through
    const dbUserData = await User.findOne({
      where: {
          id: req.session.user_id
      },
    })
    // if the email is not found, return an error
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    const user = dbUserData.get({ plain: true });
    res.render('edit-user', {user, loggedIn: true});

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }       
});

module.exports = router;