// 引入
var mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

// 设计集合结构
var replyCommentSchema = new Schema({
    // 回复人
    replyCommentator: {
        type: String,
        required: true
    },
    // 回复内容
    replyComment: {
        type: String,
        required: true
    },
    // 回复时间
    replyCommentTime: {
        type: Date,
        default: Date.now
    },
    // 约束在对应评论
    replyCommentId: {
        type: String,
        required: true
    },
    // 点赞数
    replyPraiseNumber: {
        type: Number,
        default: 0
    }
});

// 导出
module.exports = mongoose.model('ReplyComment', replyCommentSchema);