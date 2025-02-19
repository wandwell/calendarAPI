const router = require('express').Router();
const { authenticateToken } = require('../middleware/authMiddleware.js');
const usersController = require('../controllers/users.js');

router.get('/:id', authenticateToken, usersController.getSingle);

router.post('/',  usersController.createUser);

router.put('/:id', authenticateToken, usersController.updateUser);

router.delete('/:id', authenticateToken, usersController.deleteUser);

router.put('/favorites/:id', authenticateToken, usersController.updateFavorites);

router.put('/exclude/:id', authenticateToken, usersController.updateDislikes);

module.exports = router;