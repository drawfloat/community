// 引入
var mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

// 设计集合结构
var commentSchema = new Schema({
    // 回复人
    commentator: {
        type: String,
        required: true
    },
    // 评论人id
    commentatorId: {
        type: String,
        required: true
    },
    // 回复内容
    comment: {
        type: String,
        required: true
    },
    // 回复时间
    commentTime: {
        type: String,
        required: true
    },
    // 约束在对应文章
    ofTopicId: {
        type: String,
        required: true
    },
    // 点赞数
    praiseNumber: {
        type: Number,
        default: 0
    }
});

// 导出
module.exports = mongoose.model('Comment', commentSchema);