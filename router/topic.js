var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');
var Comment = require('../model/comment');
var IsPraise = require('../model/isPraise');
var IsStar = require('../model/isStar');

var router = express.Router();


// 渲染发表博客页面
router.get('/topic/new', function (req, res, next) {
    res.render('topic/new.html', {
        // 确保登录状态
        user: req.session.user
    });
});

// 发表帖子
router.post('/topic/new', function (req, res, next) {
    var body = req.body;
    // 如果标题或者内容为空
    if (!body.title || !body.content) {
        return res.status(200).json({
            err_code: 1,
            message: '标题或内容为空!'
        });
    }
    // 会因为缓存原因导致一次登录只能计数一次 所以在存储前需要读取数据库里面的数据
    User.findById(body.authorId)
        .then(function (user) {
            if (user.status === 1) {
                return res.status(200).json({
                    err_code: 2,
                    message: '您已被限制发言'
                });
            } else {
                var essayNumber = user.essayNumber + 1;
                User.findByIdAndUpdate(body.authorId, {
                        essayNumber: essayNumber
                    })
                    .then(function () {
                        // 保存数据到数据库 对时间进行统一处理
                        body.createdTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                        return new Topic(body).save();
                    })
                    .then(function (topic) {
                        res.status(200).json({
                            err_code: 0,
                            topic_id: topic._id,
                            message: 'OK'
                        });
                    })
            }
        })
        .catch(err => next(err));
});

// 查看文章
router.get('/topic/read', function (req, res, next) {
    let body = req.query;
    // 通过GET请求参数获取_id
    let topic_id = body.topic_id.replace(/"/g, '');
    // 若参数中有用户信息
    if (req.session.user) {
        var user_id = req.session.user._id;
    }
    let data = {};
    // 查询帖子信息
    Topic.findById(topic_id)
        .then(function (topic) {
            return topic;
        })
        .then(function (topic) {
            data.topic = topic;
            // 找到帖子所属评论
            return Comment.find({
                ofTopicId: topic_id
            })
        })
        .then(function (comment) {
            data.comment = comment;
            // 当前用户在这篇帖子点赞的评论
            return IsPraise.find({
                topicId: topic_id,
                userId: user_id
            });
        })
        .then(function (praiseData) {
            data.praiseData = praiseData;
            // 当前用户是否标星这篇帖子
            return IsStar.find({
                topicId: topic_id,
                userId: user_id
            });
        })
        .then(function (starData) {
            data.starData = starData;
            res.render('topic/essay.html', {
                user: req.session.user,
                topic: data.topic,
                comment: data.comment,
                praiseData: data.praiseData,
                starData: data.starData
            });
        })
        .catch(err => next(err));
});

// 给帖子标星
router.get('/essay/star', function (req, res, next) {
    var body = req.query;
    body.starNumber = parseInt(body.starNumber);
    Topic.findByIdAndUpdate(body.topicId, {
            starNumber: body.starNumber
        })
        .catch(function (err) {
            next(err);
        })
        .then(function () {
            return IsStar.findOneAndUpdate({
                topicId: body.topicId,
                userId: body.userId
            }, {
                userId: body.userId,
                topicId: body.topicId,
                isStar: body.isStar
            }, {
                // 如果不存在 则新建
                upsert: true
            });
        })
        .then(function () {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(err => next(err));
});

// 最新帖子
router.get('/recentTopic', function (req, res, next) {
    Topic.find({
            isDelete: false
        }, null, {
            sort: '-createdTime',
            limit: 20
        })
        .then(function (topic) {
            res.render('topic/modelTopic.html', {
                user: req.session.user,
                topic: topic,
                activeMark: 1
            });
        })
        .catch(err => next(err));

});

// 最火帖子
router.get('/hotTopic', function (req, res, next) {
    Topic.find({
            isDelete: false,
            starNumber: {
                $gt: 0
            }
        }, null, {
            sort: '-starNumber',
            limit: 20
        })
        .then(function (topic) {
            res.render('topic/modelTopic.html', {
                user: req.session.user,
                topic: topic,
                activeMark: 2
            });
        })
        .catch(err => next(err));
});

// 分享帖子
router.get('/shareTopic', function (req, res, next) {
    Topic.find({
            isDelete: false,
            model: '分享'
        }, null, {
            sort: '-starNumber -createdTime',
            limit: 20
        })
        .then(function (topic) {
            res.render('topic/modelTopic.html', {
                user: req.session.user,
                topic: topic,
                activeMark: 3
            });
        })
        .catch(err => next(err));
});

// 问答帖子
router.get('/questionTopic', function (req, res, next) {
    Topic.find({
            isDelete: false,
            model: '问答'
        }, null, {
            sort: '-starNumber -createdTime',
            limit: 20
        })
        .then(function (topic) {
            res.render('topic/modelTopic.html', {
                user: req.session.user,
                topic: topic,
                activeMark: 3
            });
        })
        .catch(err => next(err));
});

// 招聘帖子
router.get('/offerTopic', function (req, res, next) {
    Topic.find({
            isDelete: false,
            model: '招聘'
        }, null, {
            sort: '-starNumber -createdTime',
            limit: 20
        })
        .then(function (topic) {
            res.render('topic/modelTopic.html', {
                user: req.session.user,
                topic: topic,
                activeMark: 3
            });
        })
        .catch(err => next(err));
});

// 帖子搜索
router.post('/topic_search', function (req, res, next) {
    var body = req.body;
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


module.exports = router;