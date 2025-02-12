const router = require('express').Router();
const eventsController = require('../controllers/events.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

// Route to get all events for the authenticated user
router.get('/', isAuthenticated, eventsController.getAllForUser);

// Route to create a new event
router.post('/', isAuthenticated, eventsController.createEvent);

// Route to get a specific event by id
router.get('/:id', isAuthenticated, eventsController.getSingle);

// Route to update a specific event by id
router.put('/:id', isAuthenticated, eventsController.updateEvent);

// Route to delete a specific event by id
router.delete('/:id', isAuthenticated, eventsController.deleteEvent);

module.exports = router;
