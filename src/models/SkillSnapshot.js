const mongoose = require('mongoose');

const skillSnapshotSchema = new mongoose.Schema({
    snapshot_id: { type: Number, required: true, unique: true },
    user_id: { type: String, required: true, ref: 'User' },
    learning_path_id: { type: Number, required: true, ref: 'LearningPath' },
    snapshot_date: { type: Date, required: true },
    skill_data: { type: Map, of: Number },
    strongest_skill: { type: String, maxlength: 100 },
    weakest_skill: { type: String, maxlength: 100 },
    average_score: { type: Number, min: 0, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('SkillSnapshot', skillSnapshotSchema);