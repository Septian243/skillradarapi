const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    user_name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    active_learning_path_id: { type: Number, ref: 'LearningPath' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);