const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    from: {
      type: String,
      required: true
    },
    fromLang: {
      type: String,
      required: true
    },
    to: [
      {
        type: String,
        required: true
      }
    ],
    toLang: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Flashcard', postSchema);
