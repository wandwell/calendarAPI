const { User } = require('../models/users');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const lists = await User.findById(userId);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      favorites: req.body.favorites,
      dislikes: req.body.dislikes,
    });

    const response = await user.save();

    if (response) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while updating the user.');
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    username: req.body.username,
    password: hashedPassword,
    favorites: req.body.favorites,
    dislikes: req.body.dislikes,
  };

  const response = await User.findByIdAndUpdate(userId, user, { new: true });

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json('Some error occurred while updating the user.');
  }
};

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  req.logout((err) => {
    if (err) {
      return res.status(500).json('Some error occurred while logging out the user.');
    }

    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json('Some error occurred while destroying the session.');
      }

      const response = await User.findByIdAndDelete(userId);

      if (response) {
        res.status(204).send();
      } else {
        res.status(500).json('Some error occurred while deleting the user.');
      }
    });
  });
};

const updateFavorites = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const { favorites } = req.body;

  console.log('Received favorites:', favorites); // Log the received dislikes array

  if (!Array.isArray(favorites)) {
    return res.status(400).json({ message: 'Favorites must be an array' });
  }

  try {
    const response = await User.findByIdAndUpdate(
      userId,
      { $set: { favorites } },
      { new: true }
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDislikes = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const { dislikes } = req.body;

  console.log('Received dislikes:', dislikes); // Log the received dislikes array

  if (!Array.isArray(dislikes)) {
    return res.status(400).json({ message: 'Dislikes must be an array' });
  }

  try {
    const response = await User.findByIdAndUpdate(
      userId,
      { $set: { dislikes } },
      { new: true }
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  getSingle,
  createUser,
  updateUser,
  deleteUser,
  updateFavorites,
  updateDislikes
};
