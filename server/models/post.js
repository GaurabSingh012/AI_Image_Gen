import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  prompt: { 
    type: String, 
    required: true 
  },
  photo: { 
    type: String, 
    required: true 
  },
  // The crucial new field: permanently links this post to a specific User ID
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;