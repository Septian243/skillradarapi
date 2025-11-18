const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skill_id: { type: String, required: true, unique: true },
    skill_name: { type: String, required: true, maxlength: 100 },
    learning_path_id: { type: Number, required: true, ref: 'LearningPath' },
    display_order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);