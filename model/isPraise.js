var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var isPraiseSchema = new Schema({
    //评论id 
    commentId: {
        type: String,
        required: true
    },
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
    // 点赞或踩的状态 1为点赞 0为无操作 -1为踩 默认无操作
    isPraise: {
        type: Number,
        enum: [-1, 0, 1],
        default: 0
    }
});

module.exports = mongoose.model('IsPraise', isPraiseSchema);