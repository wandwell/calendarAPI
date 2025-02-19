const router = require('express').Router();
const eventsController = require('../controllers/events.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

// Route to get all events for the authenticated user
router.get('/', isAuthenticated, (req, res) => {
    console.log("Session in /events route:", req.session);
    eventsController.getAllForUser(req, res);
});

router.post('/', isAuthenticated, (req, res) => {
    console.log("Session in /events POST route:", req.session);
    eventsController.createEvent(req, res);
});

router.get('/:id', isAuthenticated, (req, res) => {
    console.log("Session in /events/:id route:", req.session);
    eventsController.getSingle(req, res);
});

router.put('/:id', isAuthenticated, (req, res) => {
    console.log("Session in /events PUT route:", req.session);
    eventsController.updateEvent(req, res);
});

router.delete('/:id', isAuthenticated, (req, res) => {
    console.log("Session in /events DELETE route:", req.session);
    eventsController.deleteEvent(req, res);
});

