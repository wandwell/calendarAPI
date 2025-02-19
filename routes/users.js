const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authenticate.js');
const usersController = require('../controllers/users.js');

router.get('/:id',  usersController.getSingle);

router.post('/',  usersController.createUser);

router.put('/:id',  usersController.updateUser);

router.delete('/:id',  usersController.deleteUser);

router.put('/favorites/:id', usersController.updateFavorites);

router.put('/exclude/:id', usersController.updateDislikes);

module.exports = router;