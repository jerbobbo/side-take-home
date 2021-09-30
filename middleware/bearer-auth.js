const { AuthenticationError } = require("apollo-server-errors");
const { getUsersCollection } = require("../stores/mongodb/store");

module.exports = async function(req, res, next) {
  const { token } = req;
  const userCollection = getUsersCollection();
  const foundUser = await userCollection.findOne({ token });
  if (!foundUser) {
    const err = new AuthenticationError('Unauthorized');
    err.status = 401;
    return next(err);
  }
  next();
}
