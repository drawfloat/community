// 引入
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Mongoose会弃用一些指令，防止警告信息
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;
// 连接数据库

// 设计集合结构
var userSchema = new Schema({
    // 邮箱
    email: {
        type: String,
        required: true
    },
    // 昵称
    nickname: {
        type: String,
        required: true
    },
    // 密码
    password: {
        type: String,
        required: true
    },
    // 创建时间
    createdTime: {
        type: String,
        required: true
    },
    // 头像
    avatar: {
        type: String,
        default: '/public/img/avatar-default.png'
    },
    // 简介
    bio: {
        type: String,
        default: ''
    },
    // 性别 0为男 1为女 2为保密
    gender: {
        type: Number,
        enum: [0, 1, 2],
        default: 2
    },
    // 生日
    birthday: {
        type: String
    },
    // 权限限制
    status: {
        type: Number,
        // 0 没有权限限制
        // 1 不可以评论和发帖
        enum: [0, 1],
        default: 0
    },
    // 发表帖子数量
    essayNumber: {
        type: Number,
        default: 0
    },
    // 管理员字段
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// 导出
module.exports = mongoose.model('User', userSchema);