import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String    
    },
    image: {
        type: String
    },
    alt: { 
        type: String 
    },
    color: { 
        type: String 
    },
    id: {
        type: String
    }
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;