const router = require('express').Router();
const eventsController = require('../controllers/events.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

// Route to get all events for the authenticated user
router.get('/', eventsController.getAllForUser);

// Route to create a new event
router.post('/', eventsController.createEvent);

// Route to get a specific event by id
router.get('/:id', eventsController.getSingle);

// Route to update a specific event by id
router.put('/:id', eventsController.updateEvent);

// Route to delete a specific event by id
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
