var mongoose = require('mongoose');
var nodes = require('./nodes');

// define the schema for user
var tracksSchema = mongoose.Schema({

    track: {
      id: String,
      name: String,
      overView: String,
      price: Number,
      nodes: [nodes.schema]
    }

});

// create the model for tracks
const Track = mongoose.model('Tracks', tracksSchema);

// Export Tracks for shared access 
module.exports = Track;
