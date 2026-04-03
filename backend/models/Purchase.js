import mongoose from 'mongoose';

const purchaseSchema = mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    total: { type: Number, required: true },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
