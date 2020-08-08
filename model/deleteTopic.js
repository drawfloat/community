// 引入
var mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;

// 设计集合结构
var deleteTopicSchema = new Schema({
    // 发表人
    author: {
        type: String,
        required: true
    },
    // 模块
    model: {
        type: String,
        required: true
    },
    // 标题
    title: {
        type: String,
        required: true
    },
    // 内容
    content: {
        type: String,
        required: true
    },
    // 创建时间
    createdTime: {
        type: String,
        required: true
    },
    // 作者的user _id信息
    authorId: {
        type: String,
        required: true
    },
    // 标星数
    starNumber: {
        type: Number,
        default: 0
    },
    // 置顶信息
    isTop: {
        type: Boolean,
        default: false
    }
});

// 导出
module.exports = mongoose.model('DeleteTopic', deleteTopicSchema);