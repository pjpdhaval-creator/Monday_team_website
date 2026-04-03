import mongoose from 'mongoose';

const saleSchema = mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
