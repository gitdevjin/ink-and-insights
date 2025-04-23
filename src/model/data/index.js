const database = {
  post: require(`./${process.env.DATABASE_STRATEGY}/post`),
  comment: require(`./${process.env.DATABASE_STRATEGY}/comment`),
  profile: require(`./${process.env.DATABASE_STRATEGY}/profile`),
};

module.exports = database;
