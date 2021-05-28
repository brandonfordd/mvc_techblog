// Dependencies
// Express.js connection
const router = require('express').Router();
// User Model, Post Model, and Comment Model
const { User, Post, Comment } = require('../../models');
// Sequelize database connection
const sequelize = require('../../config/connection');
// Authorization Helper
const withAuth = require('../../utils/auth');

// Routes
// GET api/posts/ -- get all posts
router.get('/', async (req, res) => {
  try {
      // create method
  // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
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
    // otherwise, return the data for the requested user
    res.json(dbPostData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/users/:id -- get user by id
router.get('/:id', async (req, res) => {
  try {
      // create method
  // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    const dbUserData = await User.findOne({
      // when the data is sent back, exclude the password property
      attributes: { exclude: ['password'] },
      where: {
        // use id as the parameter for the request
        id: req.params.id
      },
      // include the posts the user has created, the posts the user has commented on, and the posts the user has upvoted
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_text', 'created_at']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: Post,
                attributes: ['title']
            }
        }
      ]
    })
    if (!dbUserData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    // otherwise, return the data for the requested user
    res.json(dbUserData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST api/posts -- create a new post
router.post('/', withAuth, async (req, res) => {
  try {
   // expects object of the form {title: 'Sample Title Here', post_text: 'Here's some sample text for a post.', user_id: 1}
    const dbPostData = await Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id
    })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // otherwise, return the data for the requested user
    res.json(dbPostData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT api/posts/1-- update a post's title or text
router.put('/edit/:id', withAuth ,  async (req, res) => {
  try {
    const dbPostData = await Post.update(req.body, {
      where: {
        // use id as the parameter for the request
        id: req.params.id
      }
    })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('edit-post', { posts, loggedIn: true });
    
  
    // otherwise, return the data for the requested user
    res.json(dbPostData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE api/posts/1 -- delete a post
router.delete('/:id', withAuth , async (req, res) => {
  try {
      // create method
      // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    const dbPostData = await Post.destroy({
      where: {
        // use id as the parameter for the request
        id: req.params.id
      }
    })
    if (!dbPostData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // otherwise, return the data for the requested user
    res.json(dbPostData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;