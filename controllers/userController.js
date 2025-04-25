exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'all users',
  });
};

exports.getUser = (req, res) => {
  const id = req.params.id;

  res.status(200).json({
    status: 'success',
    message: `user ${id}`,
  });
};

exports.postUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'post user',
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update user',
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'delete users',
  });
};
