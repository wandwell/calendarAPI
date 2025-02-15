const { Event } = require('../models/events');
const ObjectId = require('mongodb').ObjectId;


const getSingle = async (req, res) => {
  //#swaggertags=['events']
  try {
    const eventId = new ObjectId(req.params.id);
    const event = await Event.findById(eventId);
    
    if (event.userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only access your own events' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createEvent = async (req, res, next) => {
  //#swaggertags=['events']
  try {
    const event = new Event({
      userId: req.session.user._id, // Assign the userId from the session
      date: req.body.date,
      meal: req.body.meal,
      recipeId: req.body.recipeId,
      name: req.body.name,
      servings: req.body.servings
    });

    const response = await event.save();

    if (response) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while updating the event.');
    }
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res) => {
  //#swaggertags=['events']
  const eventId = new ObjectId(req.params.id);
  const event = {
    date: req.body.date,
    meal: req.body.meal,
    recipeId: req.body.recipeId,
    name: req.body.name,
    servings: req.body.servings
  };

  const response = await Event.findByIdAndUpdate(eventId, event, { new: true });

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json('Some error occurred while updating the event.');
  }
};

const deleteEvent = async (req, res) => {
  const eventId = new ObjectId(req.params.id);
  const response = await Event.findByIdAndDelete(eventId);

  if (response) {
    res.status(204).send();
  } else {
    res.status(500).json('Some error occurred while deleting the event.');
  }
};

// New function to get all events for the authenticated user
const getAllForUser = async (req, res) => {
  try {
    const userId = req.session.user._id.toString();
    console.log(userId);
    const events = await Event.find({ userId: userId });
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getSingle,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllForUser
};
