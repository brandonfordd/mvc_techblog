// Dependencies
// Express.js connection
const router = require('express').Router();
// User, Post, Vote models
const { User, Post, Comment } = require('../../models');
// Express Session for the session data
const session = require('express-session');
// Authorization Helper
const withAuth = require('../../utils/auth');
// Sequelize store to save the session so the user can remain logged in
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Routes

// GET /api/users -- get all users
router.post('/', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findAll(req.body, {
        // when the data is sent back, exclude the password property
        attributes: { exclude: ['password'] }
    })
    if (!dbUserData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No user found with this id' });
      return;
    } 
      res.json(dbUserData);
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

// POST /api/users -- add a new user
router.post('/', async (req, res) => {
  try {
      // create method
  // expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
  
    })
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    // otherwise, save the session, and return the user object and a success message
    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
    
      res.json(dbUserData);
    });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST /api/users/login -- login route for a user
router.post('/login', async (req, res) => {
  try {
    // findOne method by email to look for an existing user in the database with the email address entered
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    // if the email is not found, return an error
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    // Otherwise, verify the user.
    // call the instance method as defined in the User model
    const validPassword = dbUserData.checkPassword(req.body.password);
    // if the password is invalid (method returns false), return an error
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    // otherwise, save the session, and return the user object and a success message
    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
    
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }       
});

// POST /api/users/logout -- log out an existing user
router.post('/logout', withAuth, async (req, res) => {
  try {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        // 204 status is that a request has succeeded, but client does not need to go to a different page
          // (200 indicates success and that a newly updated page should be loaded, 201 is for a resource being created)
        res.status(204).end();
      });
    } else {
      // if there is no session, then the logout request will send back a no resource found status
      res.status(404).end();
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.put('/:id', withAuth, async (req, res) => {
  try {
    // update method
    // if req.body has exact key/value pairs to match the model, 
    // you can just use `req.body` instead of calling out each property,
    // allowing for updating only key/value pairs that are passed through
    const dbUserData = await User.update(req.body, {
      // since there is a hook to hash only the password, the option is noted here
      individualHooks: true,
      // use the id as the parameter for the individual user to be updated
      where: {
          id: req.params.id
      }
    })

    if (!dbUserData[0]) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }

    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})


router.delete('/:id', withAuth , async (req, res) => {
  try {
    const dbUserData = await User.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }       
});




module.exports = router;