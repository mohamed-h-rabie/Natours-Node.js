const express = require('express');

const {
  getAllUsers,
  getUser,
  postUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const router = express.Router();

router.route('/').get(getAllUsers).post(postUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
