import mongoose, { model, Schema} from "mongoose";

const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    notes: {
        type: String,
    },
    transcript: {
        type: String,
    },
    image: {
        type: [String],
    },
    share:{
        type: Boolean,
        default: false,
    },
    audio: {    
        type: String,
    },
    favourite: {
        type: Boolean,
        default: false,
    },
    shareLink: {
        type: String,
    },
    date: { 
        type: Date,
        default: Date.now,
    },
    duration: {
        type: String,
    }
});

export const ContentModel = model('Content', contentSchema);