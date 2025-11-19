class CalculationUtils {
    static calculateCourseScore(nilaiUjian, nilaiSubmission) {
        if (!nilaiUjian) return 0;

        const ujianScaled = (nilaiUjian / 100) * 5;

        if (!nilaiSubmission) {
            return parseFloat(ujianScaled.toFixed(2));
        }

        const ujianScore = ujianScaled * 0.3;
        const submissionScore = nilaiSubmission * 0.7;
        return parseFloat((ujianScore + submissionScore).toFixed(2));
    }

    static calculateSkillScore(courseScores) {
        let totalScore = 0;

        for (const item of courseScores) {
            totalScore += (item.score * item.bobot) / 100;
        }

        return parseFloat(totalScore.toFixed(2));
    }

    static calculateSummary(skills) {
        if (!skills || skills.length === 0) {
            return { strongest: null, weakest: null, average: 0 };
        }

        const sorted = [...skills].sort((a, b) => b.score - a.score);
        const total = skills.reduce((sum, skill) => sum + skill.score, 0);
        const average = parseFloat((total / skills.length).toFixed(2));

        return {
            strongest: sorted[0].name,
            weakest: sorted[sorted.length - 1].name,
            average
        };
    }
}

module.exports = CalculationUtils;