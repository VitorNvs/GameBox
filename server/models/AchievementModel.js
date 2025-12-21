import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    rule: { 
        type: String 
    },
    icon: { 
        type: String 
    }
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

export default Achievement;