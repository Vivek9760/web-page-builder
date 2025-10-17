const WebPageSchema = (mongoose) => {
  const { Schema } = mongoose;

  const BlockSchema = new Schema({
    id: { type: String },
    type: {
      type: String,
      enum: ["text", "image", "button", "container", "form", "divider", "card", "list"],
      required: true,
    },
    content: Schema.Types.Mixed,
    styles: {
      backgroundColor: String,
      color: String,
      fontSize: String,
      padding: String,
      margin: String,
      borderRadius: String,
      border: String,
      width: String,
      height: String,
    },
  });

  BlockSchema.add({
    children: [BlockSchema],
  });

  return new Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, unique: true, required: true },
      author: { type: Schema.Types.ObjectId, ref: "User", required: true },
      blocks: [BlockSchema],
      status: { type: String, enum: ["draft", "published"], default: "draft" },
    },
    { timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } }
  );
};

module.exports = WebPageSchema;