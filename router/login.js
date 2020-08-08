var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');
var md5 = require('blueimp-md5');

var router = express.Router();

// 渲染首页
router.get('/', function (req, res, next) {
    // 保存链式编程的数据
    let data = {};
    // 活跃用户数量限制
    let activeLimit = 5;
    // 首页置顶帖子限制
    let topTopicLimit = 3;
    // page对象
    let page = {};
    // 每一页帖子的数量
    page.pagesize = 10;
    // 查询数据库并分页
    Topic.find({
            isDelete: false
        }, null, {
            sort: '-starNumber -createdTime',
            limit: page.pagesize
        })
        // 对首页的帖子进行第一页限制
        .then(function (indexLimitTopic) {
            data.indexLimitTopic = indexLimitTopic;
            // 若没有手动置顶的帖子 则默认置顶标星数最高的三个帖子
            data.defaultTopTopic = indexLimitTopic.slice(0, topTopicLimit);
        })
        // 置顶帖子查询
        .then(function () {
            return Topic.find({
                isTop: true
            }, null, {
                sort: '-starNumber',
                limit: topTopicLimit
            });
        })
        .then(function (TopTopic) {
            data.TopTopic = TopTopic;
            // 数据库分页查询所有帖子
            return Topic.find({});
        })
        .then(function (allTopic) {
            // 帖子总数量
            page.total = allTopic.length;
            // 帖子的页数
            page.pages = parseInt(page.total / page.pagesize) + 1;
            // 活跃用户
            return User.find({}, null, {
                sort: '-essayNumber nickname',
                limit: activeLimit
            });
        })
        .then(function (activeUser) {
            res.render('index.html', {
                user: req.session.user,
                topic: data.indexLimitTopic,
                active: activeUser,
                page: page,
                TopTopic: data.TopTopic,
                defaultTopTopic: data.defaultTopTopic,
                activeMark: 0
            });
        })
        .catch(err => next(err));
});

// 渲染注册页面
router.get('/register', function (req, res) {
    res.render('register.html');
});

// 处理注册请求
router.post('/register', function (req, res, next) {
    var body = req.body;
    // 邮箱或昵称为空
    if (!body.email || !body.nickname) {
        res.status(200).json({
            err_code: 1,
            message: '邮箱或昵称为空'
        });
    }
    // 密码长度不符合条件
    else if (parseInt(body.password.length) < 6) {
        res.status(200).json({
            err_code: 2,
            message: '密码长度小于6位'
        });
    } else {
        User.findOne({
                // 或查询
                $or: [{
                        email: body.email
                    },
                    {
                        nickname: body.nickname
                    }
                ]
            })
            .then(function (data) {
                // data存在代表邮箱被占用
                if (data) {
                    return res.status(200).json({
                        err_code: 3,
                        message: '邮箱或昵称已存在'
                    });
                } else {
                    // 加密
                    req.body.password = md5(md5(req.body.password));
                    req.body.createdTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                    // 如果邮箱和昵称不重复 将数据保存在数据库
                    new User(req.body).save()
                        .then(function (user) {
                            // 注册成功 使用Session 记录用户登录状态
                            req.session.user = user;
                            // 在客户端jQuery设置了将json格式的字符串转换成json数据,所以必须响应JSON格式的字符串
                            res.status(200).json({
                                err_code: 0,
                                message: 'OK'
                            });
                        })
                }
            })
            .catch(function (err) {
                next(err);
            });
    }
});

// 渲染登录页面
router.get('/login', function (req, res) {
    res.render('login.html');
});

// 处理登录请求
router.post('/login', function (req, res, next) {
    User.findOne({
            email: req.body.email,
            password: md5(md5(req.body.password))
        })
        .then(function (user) {
            if (!user) {
                return res.status(200).json({
                    err_code: 1,
                    message: '邮箱或者密码错误!'
                });
            }
            req.session.user = user;
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 处理退出请求
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
    // res.redirect('/login');
});


module.exports = router;