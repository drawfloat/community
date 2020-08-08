var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

// 登录注册模块
var login = require('./router/login');
// 话题模块
var topic = require('./router/topic');
// 评论
var comment = require('./router/comment');
// 账户设置
var profile = require('./router/profile');
// 分页请求
var pagination = require('./router/pagination');
// 个人主页
var personal = require('./router/personal');
// 管理员模块
var admin = require('./router/admin');



var app = express();

// 开放静态资源 动态绝对路径
app.use('/public', express.static(path.join(__dirname, './public/')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')));

// 在Express中获取表单POST请求体数据
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// 处理Session和Cookie的第三方中间件
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// 模版引擎
app.engine('html', require('express-art-template'));

// 挂载路由
app.use(login);
app.use(topic);
app.use(comment);
app.use(profile);
app.use(pagination);
app.use(personal);
app.use(admin);

// 404处理中间件
app.use(function (req, res) {
    res.send('404 NOT FOUND');
});

// 统一错误处理中间件
app.use(function (err, req, res, next) {
    res.status(500).send(err.message);
});

app.listen(3000, function () {
    console.log('server is running');
});