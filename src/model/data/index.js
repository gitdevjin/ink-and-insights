const database = {
  post: require(`./${process.env.DATABASE_STRATEGY}/post`),
  comment: require(`./${process.env.DATABASE_STRATEGY}/comment`),
  //user: require(`./${process.env.DATABASE_STRATEGY}/user`), // Add more models here
};

module.exports = database;
