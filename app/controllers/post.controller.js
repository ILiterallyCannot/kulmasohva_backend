const Post = require("../models/post.model");

exports.createPost = (req, res) => {
    const { title, content, date, userId } = req.body;

    const post = new Post({
        title,
        content,
        date,
        userId
      });
  
    post.save()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send({ message: err.message }));
  };
  
  exports.getAllPosts = (req, res) => {
    Post.find().populate()
      .then(posts => res.status(200).send(posts))
      .catch(err => res.status(500).send({ message: err.message }));
  };
  
  exports.getPostsByUser = (req, res) => {
    Post.find({ userId: req.params.userId }).populate('userId', 'username')
      .then(posts => res.status(200).send(posts))
      .catch(err => res.status(500).send({ message: err.message }));
  };

  exports.deletePost = (req, res) => {
    Post.findByIdAndDelete(req.params.id).then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Post not found" });
      }
      res.send({ message: "Post was deleted successfully!" });
    })
    .catch(() => {
      res.status(500).send({ message: "Could not delete post" });
    });
  };