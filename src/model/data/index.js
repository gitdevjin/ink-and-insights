if (process.env.DATABASE_STRATEGY === 'local') {
  module.exports = require('./memory/');
}
// AWS And SQL DB
else if (process.env.DATABASE_STRATEGY === 'remote') {
  module.exports = require('./remote');
  // ELSE, ERROR
} else {
  console.log('DATABASE STRATEGY is not selected');
}
