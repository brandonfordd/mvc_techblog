// Dependencies
// Express.js connection
const router = require('express').Router();
// Comment model
const { Comment } = require('../../models');
// Authorization Helper
const withAuth = require('../../utils/auth');

// Routes

// Get comments
router.get('/', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll(req.body, {})
    if (!dbCommentData) {
      // if no user is found, return an error
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    } 
      res.json(dbCommentData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post a new comment
router.post('/', withAuth, async (req, res) => {
    try {
      const dbCommentData = await Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        // use the user id from the session
        user_id: req.session.user_id
      })
      if (!dbCommentData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
      res.json(dbCommentData)
    
    } catch(err) {
      console.log(err);
      res.status(500).json(err);
    }
});



// delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!dbCommentData) {
      res.status(400).json({ message: 'No comment with that email address!' });
      return;
    }
    res.json(dbCommentData)
  
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;