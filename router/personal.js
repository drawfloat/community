var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');

var router = express.Router();

// 访问主页
router.get('/personal/personal', function (req, res, next) {
    var body = req.query;
    var personal_id = body.personal_id.replace(/"/g, '');
    User.findById(personal_id)
        .then(function (personal) {
            return personal;
        })
        .then(function (personal) {
            Topic.find({
                    authorId: personal_id,
                    isDelete: false
                }, null, {
                    sort: '-createdTime'
                })
                .then(function (topic) {
                    return topic;
                })
                .then(function (topic) {
                    res.render('personal/personal.html', {
                        user: req.session.user,
                        personal: personal,
                        topic: topic
                    });
                })
        })
        .catch(function (err) {
            next(err);
        });
});


module.exports = router;