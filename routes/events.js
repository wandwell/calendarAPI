const router = require('express').Router();
const eventsController = require('../controllers/events.js');
const { authenticateToken } = require('../middleware/authMiddleware.js');

// Route to get all events for the authenticated user
router.get('/:id', authenticateToken, eventsController.getAllForUser);

// Route to create a new event
router.post('/', authenticateToken, eventsController.createEvent);

// Route to get a specific event by id
router.get('/:id', authenticateToken, eventsController.getSingle);

// Route to update a specific event by id
router.put('/:id', authenticateToken, eventsController.updateEvent);

// Route to delete a specific event by id
router.delete('/:id', authenticateToken, eventsController.deleteEvent);

module.exports = router;
