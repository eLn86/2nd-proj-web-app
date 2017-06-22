var mongoose = require('mongoose');

var nodesSchema = mongoose.Schema({

      nodeNumber: Number,
      topic: String,
      xrayImage: String,
      question: String,
      options: {
        a: String,
        b: String,
        c: String,
        d: String
      },
      correctAnswer: String

});

// create the model for nodes
const TrackNodes = mongoose.model('nodes', nodesSchema);

// Export Nodes for shared access
module.exports = TrackNodes;
