module.exports.validationError = (err, req, res) => {
  if (err.name === 'ValidationError') {
    res.status(400);
  } else {
    res.status(500);
  }
  res.send({ message: err.message });
};
