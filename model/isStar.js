var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var isStarSchema = new Schema({
    // 用户id
    userId: {
        type: String,
        required: true
    },
    // 帖子id
    topicId: {
        type: String,
        required: true
    },
    // 点赞或踩的状态 1为标星 0为无操作
    isStar: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
});

module.exports = mongoose.model('IsStar', isStarSchema);