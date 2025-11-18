const mongoose = require('mongoose');

const courseSkillSchema = new mongoose.Schema({
    course_skill_id: { type: String, required: true, unique: true },
    course_id: { type: String, required: true, ref: 'Course' },
    skill_id: { type: String, required: true, ref: 'Skill' },
    bobot: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('CourseSkill', courseSkillSchema);