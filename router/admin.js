var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');
// var TopTopic = require('../model/topTopic');

var router = express.Router();

// 渲染管理员页面
router.get('/admin', function (req, res, next) {
    // page对象
    let page = {};
    // 每一页帖子的数量
    page.pagesize = 10;
    // 查询数据库并分页
    var data = {};
    Topic.find({
            isTop: false,
            isDelete: false
        }, null, {
            sort: '-createdTime',
            limit: page.pagesize
        })
        .then(function (normalTopic) {
            data.normalTopic = normalTopic;
            // 避免limit对分页造成影响
            return Topic.find();
        })
        .then(function (allTopic) {
            data.allTopic = allTopic;
            // 正常用户
            return User.find({
                status: 0
            });
        })
        .then(function (normalUser) {
            data.normalUser = normalUser;
            // 禁言用户
            return User.find({
                status: 1
            });
        })
        .then(function (gagUser) {
            // 统计被置顶帖子数量
            data.topTopicNumber = data.allTopic.filter((ele) => ele.isTop === true).length;
            // 统计被删除帖子数量
            data.deleteTopicNumber = data.allTopic.filter((ele) => ele.isDelete === true).length;
            // 统计所有帖子的数量
            data.allTopicNumber = data.allTopic.length;
            // 统计正常用户数量
            data.normalUserNumber = data.normalUser.length;
            // 统计被禁言用户数量
            data.limitUserNumber = gagUser.length;
            // data.topTopic = Array.prototype.filter.call(data.allTopic, (ele, index) => ele.isTop === true);
            // 置顶的帖子
            data.topTopic = data.allTopic.filter((ele, index) => ele.isTop === true);
            // 删除的帖子
            data.deleteTopic = data.allTopic.filter((ele, index) => ele.isDelete === true);
            // 非置顶非禁言帖子总数量
            page.total = data.allTopic.filter((ele, index) => ele.isTop === false && ele.isDelete === false).length;
            // 帖子的页数
            page.pages = parseInt(page.total / page.pagesize) + 1;
            // 渲染管理页面
            res.render('setting/admin.html', {
                user: req.session.user,
                normalTopic: data.normalTopic,
                topTopic: data.topTopic,
                deleteTopic: data.deleteTopic,
                normalUser: data.normalUser,
                gagUser: gagUser,
                page: page,
                topTopicNumber: data.topTopicNumber,
                deleteTopicNumber: data.deleteTopicNumber,
                allTopicNumber: data.allTopicNumber,
                normalUserNumber: data.normalUserNumber,
                limitUserNumber: data.limitUserNumber
            });

        })
        .catch(function (err) {
            next(err);
        });

});

// 置顶功能
router.get('/admin/top', function (req, res, next) {
    var body = req.query;
    Topic.findByIdAndUpdate(body.topic_id, {
            isTop: true
        })
        .then(function (topic) {
            // 不能先打印topic 如果打印了 返回的就是打印的topic，而不是findByIdAndUpdate更新后的topic
            return topic;
        })
        .then(function (topic) {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 取消置顶
router.get('/admin/cancel_top', function (req, res, next) {
    var body = req.query;
    Topic.findByIdAndUpdate(body.topic_id, {
            isTop: false
        })
        .then(function (topic) {
            return topic;
        })
        .then(function (topic) {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 帖子操作 局部刷新
router.get('/admin/top_reload', function (req, res, next) {
    var page = {};
    page.pagesize = 5;
    Topic.find({
            isTop: false,
            isDelete: false
        }, null, {
            sort: '-createdTime'
        })
        .then(function (topic) {
            res.status(200).json(topic);
        })
        .catch(function (err) {
            next(err);
        })
});

// 管理员删除功能
router.get('/admin/delete', function (req, res, next) {
    var body = req.query;
    Topic.findByIdAndUpdate(body.topic_id, {
            isDelete: true
        })
        .then(function (topic) {
            // 不能先打印topic 如果打印了 返回的就是打印的topic，而不是findByIdAndUpdate更新后的topic
            return topic;
        })
        .then(function (topic) {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 取消删除
router.get('/admin/cancel_delete', function (req, res, next) {
    var body = req.query;
    Topic.findByIdAndUpdate(body.topic_id, {
            isDelete: false
        })
        .then(function () {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 禁言功能
router.get('/admin/gag', function (req, res, next) {
    var body = req.query;
    User.findByIdAndUpdate(body.user_id, {
            status: 1
        })
        .then(function () {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(err => next(err));
});

// 恢复权限
router.get('/admin/cancel_gag', function (req, res, next) {
    var body = req.query;
    User.findByIdAndUpdate(body.user_id, {
            status: 0
        })
        .then(function () {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(function (err) {
            next(err);
        });
});

// 权限管理 局部刷新
router.get('/admin/limit_reload', function (req, res, next) {
    User.find({
            status: 0
        }, null, {
            sort: '-createdTime'
        })
        .then(function (user) {
            res.status(200).json(user);
        })
        .catch(err => next(err))
});

// 恢复权限 局部刷新
router.get('/admin/restore_reload', function (req, res, next) {
    User.find({
            status: 1
        }, null, {
            sort: '-createdTime'
        })
        .then(function (user) {
            res.status(200).json(user);
        })
        .catch(err => next(err))
});

// 管理员搜索帖子
router.get('/admin_search', function (req, res, next) {
    var body = req.query;
    var keywords = new RegExp(body.search_topic, 'i');
    Topic.find({
            isDelete: false,
            title: {
                $regex: keywords
            }
        }, null, {
            sort: '-starNumber -createdTime'
        })
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(err => next(err));
});

// 管理员搜索用户
router.get('/user_search', function (req, res, next) {
    var body = req.query;
    var keywords = new RegExp(body.search_user, 'i');
    User.find({
            status: 0,
            nickname: {
                $regex: keywords
            }
        }, null, {
            sort: '-createdTime'
        })
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(err => next(err));
});

module.exports = router;