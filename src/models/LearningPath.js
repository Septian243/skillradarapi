const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
    learning_path_id: { type: Number, required: true, unique: true },
    learning_path_name: { type: String, required: true, maxlength: 100 },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LearningPath', learningPathSchema);