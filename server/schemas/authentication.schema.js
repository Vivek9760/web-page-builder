const AuthenticationSchema = (mongoose) => {
    const { Schema } = mongoose;
    const { ObjectId } = Schema.Types;

    return new Schema({
        sessionId: { type: String, required: true },
        userId: { type: ObjectId, ref: 'user' },
        expiredAt: { type: Date },
    }, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });
}


module.exports = AuthenticationSchema;