const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
        answer: String,
        question: String,
        option: [{ question: String, answer: String }],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;