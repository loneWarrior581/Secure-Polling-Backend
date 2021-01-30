const mongoose = require('mongoose')

const pollSchema = mongoose.Schema({
    name: { type: String },
    choice: { type: Boolean },
    casted_at: { type: String },
});

module.exports = mongoose.model('poll', pollSchema);

