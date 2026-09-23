const NodeCache = require('node-cache');

// Create a new instance of NodeCache with a default TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

module.exports = cache;
