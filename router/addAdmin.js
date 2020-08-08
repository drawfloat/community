// var mongoose = require('mongoose');
var md5 = require('blueimp-md5');
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    // useUnifiedTopology: true
}, function (err, db) {
    if (err) {
        throw err;
    }
    // 连接test数据库的users表，插入数据
    var database = db.db('test');
    // 加密
    password = md5(md5('admin'));
    var admin = {
        email: 'admin@tests.com',
        nickname: '管理账号',
        password: password,
        isAdmin: true
    };
    database.collection('users').insertOne(admin, function (err, res) {
        if (err) {
            throw err;
        }
        console.log('管理员添加成功');
        db.close();
    });
});
// Mongoose会弃用一些指令，防止警告信息
// mongoose.set('useFindAndModify', false);