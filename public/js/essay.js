// 详细帖子页面
$(function () {
    // 标星
    // 用户登录才绑定事件
    if ($('#user_star')) {
        var starStatus = $(this).find('.starData').val();
        starStatus = parseInt(starStatus);
        // 用户对此文章已经标星
        if (starStatus === 1) {
            $('#user_star>a').css('color', 'pink');
            $('#user_star').prop('status', true);
        }

        // 绑定事件
        $('#user_star').on('click', function () {
            var clickEle = $('#user_star>a'),
                starNumberEle = $('#starNumber');
            var starNumber = parseInt($('#starNumber').text());
            // var topicId = '{{topic._id}}';
            var topicId = $('#comment_form').find('.topic_id').val();
            // topicId = topicId.replace(/&#34;/g, '');
            topicId = topicId.replace(/"/g, '');
            // var userId = '{{user&&user._id}}';
            var userId = $('#comment_form').find('.user_id').val();
            // userId = userId.replace(/&#34;/g, '');
            userId = userId.replace(/"/g, '');
            // 如果帖子没有被用户标星
            if (!$(this).prop('status')) {
                onstarChange(clickEle, 'pink', true, starNumber, starNumberEle, topicId, userId, 1);
                $(this).prop('status', true);

            } else {
                // 帖子被用户标星了
                onstarChange(clickEle, '', false, starNumber, starNumberEle, topicId, userId, 0);
                $(this).prop('status', false);
            }
        });
        // clickEle点击对象, color颜色, add加减状态, starNumber标星数, starNumberEle标星数对象, topicId帖子id
        function onstarChange(clickEle, color, add, starNumber, starNumberEle, topicId, userId, isStar) {
            clickEle.css('color', color);
            if (add) {
                starNumber++;
            } else {
                starNumber--;
            }
            starNumberEle.text(starNumber);
            // 发送请求
            $.get('/essay/star', {
                topicId: topicId,
                userId: userId,
                starNumber: starNumber,
                isStar: isStar
            });
        }
    }

    // 发表评论
    $('#comment_form').on('submit', function (e) {
        e.preventDefault()
        var formData = $(this).serialize()
        $.ajax({
            url: '/topic/read',
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (data) {
                var err_code = data.err_code
                if (err_code === 0) {
                    var topicID = data.ofTopicId;
                    topicID = topicID.replace(/&#34;/g, '');
                    // var userID = '{{user&&user._id}}';
                    var userID = data.commentatorId;
                    userID = userID.replace(/&#34;/g, '');
                    // 发表成功
                    window.alert('评论成功');
                    // 服务端重定向针对异步请求无效
                    // 重新请求需要指定文章id
                    window.location.href = '/topic/read?topic_id=' + topicID + '&user_id=' + userID;
                } else if (err_code === 1) {
                    window.alert('评论为空');
                } else if (err_code === 2) {
                    window.alert('请登录!');
                } else if (err_code === 3) {
                    window.alert('您已被限制发言！');
                } else if (err_code === 500) {
                    window.alert('服务器忙，请稍后重试！');
                }
            }
        });
    });

    // 服务端返回的点赞评论数据
    var praiseData = $('#praiseComment').children();
    // 为每个评论绑定点赞和踩功能
    $('#commentBox>.comment').each(function () {
        // 获取元素
        // 点赞
        var praise = $(this).find('.praise');
        // 踩
        var tread = $(this).find('.tread');
        // 点赞数
        var praiseNumber = $(this).find('.praiseNumber');
        // 删除评论
        var removeComment = $(this).find('.remove_comment');
        // 评论id
        var comment_id = $(this).find('.comment_id').val().replace(/"/g, '');
        // 用户id
        var user_id = $(this).find('.get_user_id').val();
        // 帖子id
        var topic_id = $('#topic_id').val().replace(/"/g, '');
        // 判断已经被当前用户点赞的评论
        praiseData.each(function (index, ele) {
            var id = $(ele).val().replace(/"/g, ''),
                status = parseInt($(ele).attr('class'));
            if (comment_id === id) {
                // 如果是点赞(1)
                if (status === 1) {
                    praise.css('color', 'pink');
                    // 将点赞状态变为true
                    praise.prop('status', true);
                    // 让点赞可以被点击
                    praise.prop('unavailable', false);
                    // 让踩不可以被点击
                    tread.prop('unavailable', true);
                    // 如果是踩(-1)
                } else if (status === -1) {
                    tread.css('color', 'pink');
                    // 将踩的状态变为true
                    tread.prop('status', true);
                    // 将踩变为可点击
                    tread.prop('unavailable', false);
                    // 将点赞变为不可点击
                    praise.prop('unavailable', true);
                }

            }
        });
        // 点赞
        praise.on('click', function () {
            var countEle = praiseNumber,
                clickEle = $(this);
            // 如果‘点赞’没有被点击
            if (!$(this).prop('status')) {
                // 默认为undfined 点赞和踩 互斥
                if (!$(this).prop('unavailable')) {
                    var isPraise = 1;
                    // 将点赞状态变为已点击
                    onClickChange(clickEle, 'pink', countEle, true, true, comment_id, user_id, isPraise, topic_id);
                    // 让踩不能被点击
                    tread.prop('unavailable', true);
                }
            } else {
                var isPraise = 0;
                onClickChange(clickEle, '', countEle, false, false, comment_id, user_id, isPraise, topic_id);
                tread.prop('unavailable', false);
            }
        });
        // 踩
        tread.on('click', function () {
            var countEle = praiseNumber,
                clickEle = $(this);
            // 如果‘踩’没有被点击
            if (!$(this).prop('status')) {
                if (!$(this).prop('unavailable')) {
                    var isPraise = -1;
                    onClickChange(clickEle, 'pink', countEle, false, true, comment_id, user_id, isPraise, topic_id);
                    praise.prop('unavailable', true);
                }
            } else {
                var isPraise = 0;
                onClickChange(clickEle, '', countEle, true, false, comment_id, user_id, isPraise, topic_id);
                praise.prop('unavailable', false);
            }
        });

        // 删除评论
        removeComment.on('click', function () {
            // 删除当前评论
            var comment = $(this).parents('.comment');
            $.get('/comment/remove', {
                comment_id: comment_id
            }, function (data, status) {
                if (data.err_code === 0) {
                    comment.remove();
                    window.alert('删除成功');
                }
            });
        });
    });

    // clickEle点击对象, color颜色, countEle计数器对象, add(Boolean)加减, status(Boolean)点击状态 comment_id评论的唯一标识
    function onClickChange(clickEle, color, countEle, add, status, comment_id, user_id, isPraise, topic_id) {
        // 设置点击对象的颜色
        clickEle.css('color', color);
        // 判断加减
        if (add) {
            var praiseNumber = parseInt(countEle.text()) + 1;
        } else {
            var praiseNumber = parseInt(countEle.text()) - 1;
        }
        $.get('/comment/praise', {
            comment_id: comment_id,
            praiseNumber: praiseNumber,
            user_id: user_id,
            isPraise: isPraise,
            topic_id: topic_id
        });
        // 设置数值
        countEle.text(praiseNumber);
        // 将状态变为已点击
        clickEle.prop('status', status);
    }
});