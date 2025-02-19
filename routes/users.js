const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authenticate.js');
const usersController = require('../controllers/users.js');

router.get('/:id', isAuthenticated, usersController.getSingle);

router.post('/',  usersController.createUser);

router.put('/:id', isAuthenticated, usersController.updateUser);

router.delete('/:id', isAuthenticated, usersController.deleteUser);

router.put('/favorites/:id', isAuthenticated, usersController.updateFavorites);

router.put('/exclude/:id', isAuthenticated, usersController.updateDislikes);

module.exports = router;