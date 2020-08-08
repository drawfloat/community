var express = require('express');
var User = require('../model/user');
var Topic = require('../model/topic');

var router = express.Router();

// 分页
router.get('/pagination', function (req, res, next) {
    let currentPage = parseInt(req.query.currentPage);
    let pagesize = parseInt(req.query.pagesize);
    Topic.find({
            isDelete: false
        }, null, {
            sort: '-starNumber -createdTime',
            skip: (currentPage - 1) * pagesize,
            limit: pagesize
        })
        .then(function (normalTopic) {
            res.status(200).json(normalTopic);
        })
        .catch(function (err) {
            next(err);
        });
});

// 管理页面分页
router.get('/admin/pagination', function (req, res, next) {
    let currentPage = parseInt(req.query.currentPage);
    let pagesize = parseInt(req.query.pagesize);
    Topic.find({
            isTop: false,
            isDelete: false
        }, null, {
            sort: '-createdTime',
            skip: (currentPage - 1) * pagesize,
            limit: pagesize
        })
        .then(function (normalTopic) {
            res.status(200).json(normalTopic);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;