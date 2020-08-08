var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');
var Comment = require('../model/comment');
var IsPraise = require('../model/isPraise');

var router = express.Router();

// 发表评论
router.post('/topic/read', function (req, res, next) {
    var body = req.body;
    body.ofTopicId = body.ofTopicId.replace(/"/g, '');
    // 检查登录状态
    if (!req.session.user) {
        return res.status(200).json({
            err_code: 2,
            message: '请登录!'
        })
    }
    // 如果标题或者内容为空
    if (!req.body.comment) {
        return res.status(200).json({
            err_code: 1,
            message: '内容为空!'
        });
    }
    User.findById(body.commentatorId)
        .then(function (user) {
            if (user.status === 1) {
                return res.status(200).json({
                    err_code: 3,
                    message: '您已被限制发言'
                });
            } else {
                // 对时间进行统一处理
                body.commentTime = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                // 保存数据到数据库
                new Comment(body).save()
                    .then(function () {
                        res.status(200).json({
                            err_code: 0,
                            message: 'OK',
                            commentatorId: body.commentatorId,
                            ofTopicId: body.ofTopicId,
                        });
                    });
            }
        })
        .catch(err => next(err));

});

// 点赞
router.get('/comment/praise', function (req, res, next) {
    var body = req.query;
    body.isPraise = parseInt(body.isPraise);
    Comment.findByIdAndUpdate(body.comment_id, {
            praiseNumber: body.praiseNumber
        })
        .catch(function (err) {
            next(err);
        })
        // 点赞对应评论是否被当前用户点赞
        .then(function () {
            return IsPraise.findOneAndUpdate({
                commentId: body.comment_id,
                userId: body.user_id
            }, {
                commentId: body.comment_id,
                userId: body.user_id,
                topicId: body.topic_id,
                isPraise: body.isPraise
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

// 删除评论
router.get('/comment/remove', function (req, res, next) {
    var body = req.query;
    Comment.findByIdAndDelete(body.comment_id)
        .then(function () {
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            });
        })
        .catch(err => next(err));
});

module.exports = router;