import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    bookName: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    purchasePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
