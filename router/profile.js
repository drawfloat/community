var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');
var md5 = require('blueimp-md5');

var router = express.Router();

// 渲染用户设置
router.get('/setting/profile', function (req, res, next) {
    req.query.id = req.query.id.replace(/"/g, '');
    if (req.session.user) {
        User.findById(req.query.id, function (err, data) {
            if (err) {
                return next(err);
            }
            res.render('setting/profile.html', {
                user: data
            });
        });
    } else {
        res.render('login.html');
    }
});

// 修改用户信息
router.post('/setting/profile', function (req, res, next) {
    var body = req.body;
    body.id = body.id.replace(/"/g, '');
    // 判断用户名是否与其他用户重复 可以与自己重复
    User.findOne({
            nickname: body.nickname
        })
        .then(function (findUser) {
            var nicknameID = null;
            // 若存在该昵称的用户
            if (findUser) {
                // 转换从数据库里面取到的该昵称用户id格式
                nicknameID = JSON.stringify(findUser._id).replace(/"/g, '');
            }
            // 若修改的昵称为空
            if (!body.nickname) {
                res.status(200).json({
                    err_code: 1,
                    message: '昵称为空！'
                });
            } else if (nicknameID && nicknameID !== body.id) {
                // 若该昵称的用户id不为空且和此用户的id不一样 说明昵称被占用
                res.status(200).json({
                    err_code: 2,
                    message: '该昵称已被占用！'
                });
            } else {
                // 若不存在该昵称或者是登录用户修改信息时昵称信息未变动 可以正常修改
                User.findByIdAndUpdate(body.id, {
                        nickname: body.nickname,
                        bio: body.bio,
                        gender: body.gender,
                        birthday: body.birthday
                    })
                    .then(function () {
                        res.status(200).json({
                            err_code: 0,
                            message: 'OK'
                        });
                    })
            }
        })
        .catch(err => next(err));
});

// 渲染账户设置
router.get('/setting/account', function (req, res, next) {
    if (req.session.user) {
        res.render('setting/account.html', {
            user: req.session.user
        });
    } else {
        res.render('login.html');
    }
});

// 修改密码
router.post('/setting/account', function (req, res, next) {
    var body = req.body;
    currentPW = md5(md5(body.current_password));
    newPW = md5(md5(body.new_password));
    User.findById(body.user_id)
        .then(function (user) {
            // 提交的当前密码和数据库密码不相等
            if (currentPW !== user.password) {
                res.status(200).json({
                    err_code: 1,
                    message: '用户密码错误'
                });
            } else {
                // 提交的当前密码正确
                User.findByIdAndUpdate(body.user_id, {
                        password: newPW
                    })
                    .then(function () {
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
});

// 账号注销
router.get('/account/delete', function (req, res, next) {
    User.findByIdAndDelete(req.query.user_id)
        .then(function () {
            req.session.destroy();
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;