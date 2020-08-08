// 管理员模块
$(function () {
    // 获取元素
    var allTopicEle = $('#topic_manage>.allTopicNumber'),
        topTopicEle = $('#topic_manage>.topTopicNumber'),
        deleteTopicEle = $('#topic_manage>.deleteTopicNumber'),
        normalUserEle = $('#user_manage>.normalUserNumber'),
        limitUserEle = $('#user_manage>.limitUserNumber');
    var allTopicNumber = parseInt(allTopicEle.text().replace(/[^0-9]/ig, "")) || 0,
        topTopicNumber = parseInt(topTopicEle.text().replace(/[^0-9]/ig, "")) || 0,
        deleteTopicNumber = parseInt(deleteTopicEle.text().replace(/[^0-9]/ig, "")) || 0,
        normalUserNumber = parseInt(normalUserEle.text().replace(/[^0-9]/ig, "")) || 0,
        limitUserNumber = parseInt(limitUserEle.text().replace(/[^0-9]/ig, "")) || 0;

    // 绑定置顶和删除操作
    $('#admin_topic').find('.admin_operate').each(function () {
        // 置顶
        $(this).find('.top_topic').on('click', function () {
            var topic_id = $(this).parents('.admin_operate').find('.topic_id').val()
                .replace(/"/g, '');
            $.get('/admin/top', {
                topic_id: topic_id
            }, function (data, status) {
                if (status === 'success') {
                    window.location.reload();
                }
            });
        });

        // 删除
        $(this).find('.delete_topic').on('click', function () {
            var topic_id = $(this).parents('.admin_operate').find('.topic_id').val()
                .replace(/"/g, '');
            $.get('/admin/delete', {
                topic_id: topic_id
            }, function (data, status) {
                if (status === 'success') {
                    window.location.reload();
                }
            });
        });
    });


    // 取消置顶
    $('#cancel_top_topic').find('.admin_operate').each(function () {
        $(this).find('.cancel_top_operate').on('click', function () {
            var topic_id = $(this).parents('.admin_operate').find('.topic_id').val()
                .replace(/"/g, '');
            $.get('/admin/cancel_top', {
                topic_id: topic_id
            });
            // 清除当前元素
            $(this).parents('tr').remove();
            topTopicNumber--;
            topTopicEle.text('累计发帖数：' + topTopicNumber + ' ;');

        });
    });
    // 取消删除
    $('#cancel_delete_topic').find('.admin_operate').each(function () {
        $(this).find('.cancel_delete_operate').on('click', function () {
            var topic_id = $(this).parents('.admin_operate').find(
                    '.topic_id').val()
                .replace(/"/g, '');
            $.get('/admin/cancel_delete', {
                topic_id: topic_id
            });
            // 清除当前元素
            $(this).parents('tr').remove();
            deleteTopicNumber--;
            deleteTopicEle.text('累计发帖数：' + deleteTopicNumber + ' ;');
        });
    });

    // 帖子操作 局部刷新
    $('#top_active').on('click', function () {
        $.get('/admin/top_reload', function (data, status) {
            if (status === 'success') {
                paginationObj.total = data.length;
                pagination.init(paginationObj);
                onTopicChange($('#admin_topic'), data, parseInt(paginationObj.pagesize));
            }
        });
    });

    // 绑定禁言操作
    $('#admin_user').find('.admin_operate').each(function () {
        // 禁言
        $(this).find('.user_gag').on('click', function () {
            var user_id = $(this).parents('.admin_operate').find('.user_id').val()
                .replace(/"/g, '');
            $.get('/admin/gag', {
                user_id: user_id
            });
            // 清除当前元素
            $(this).parents('tr').remove();
            normalUserNumber--;
            limitUserNumber++;
            normalUserEle.text('正常用户：' + normalUserNumber + ';');
            limitUserEle.text('禁言用户：' + limitUserNumber + ';');

        });
    });
    // 取消禁言
    $('#cancel_limit_user').find('.admin_operate').each(function () {
        $(this).find('.cancel_gag_operate').on('click', function () {
            var user_id = $(this).parents('.admin_operate').find('.user_id').val()
                .replace(/"/g, '');
            $.get('/admin/cancel_gag', {
                user_id: user_id
            });
            // 清除当前元素
            $(this).parents('tr').remove();
            normalUserNumber++;
            limitUserNumber--;
            normalUserEle.text('正常用户：' + normalUserNumber + ';');
            limitUserEle.text('禁言用户：' + limitUserNumber + ';');
        });
    });
    // 权限管理 局部刷新
    $('#limit_active').on('click', function () {
        $.get('/admin/limit_reload', function (data, status) {
            if (status === 'success') {
                onUserChange($('#admin_user'), data);
            }
        });
    });
    // 恢复权限 局部刷新
    $('#restore_active').on('click', function () {
        $.get('/admin/restore_reload', function (data, status) {
            if (status === 'success') {
                onRestoreChange($('#cancel_limit_user'), data);
            }
        });
    });

    // 帖子操作函数
    function onTopicChange(ele, data, pagesize) {
        // 复用函数
        pagesize = pagesize || data.length;
        ele.empty();
        for (var key in data) {
            if (key < pagesize) {
                ele.append(`
                    <tr>
                        <td>
                            ` + data[key].author + `
                        </td>
                        <td>
                            ` + data[key].title + `
                        </td>
                        <td>
                            ` + data[key].createdTime + `
                        </td>
                        <td class="admin_operate">
                            <input type="hidden" value="` + data[key]._id + `" class="topic_id">
                            <a href="javascript:;" class="btn btn-xs btn-default top_topic">置顶</a>
                            <a href="#" class="btn btn-xs btn-danger delete_topic">删除</a>
                        </td>
                    </tr>
                    `);
            }
        }
        ele.find('.admin_operate').each(function () {
            $(this).find('.top_topic').on('click', function () {
                var topic_id = $(this).parents('.admin_operate')
                    .find('.topic_id').val()
                    .replace(/"/g, '');
                $.get('/admin/top', {
                    topic_id: topic_id
                }, function (data, status) {
                    if (data.err_code === 0) {
                        window.location.reload();
                    }
                });
            });
        });
        ele.find('.admin_operate').each(function () {
            $(this).find('.delete_topic').on('click', function () {
                var topic_id = $(this).parents('.admin_operate')
                    .find('.topic_id').val()
                    .replace(/"/g, '');
                $.get('/admin/delete', {
                    topic_id: topic_id
                }, function (data, status) {
                    if (data.err_code === 0) {
                        window.location.reload();
                    }
                });
            });
        });
    }

    // 权限管理函数
    function onUserChange(ele, data) {
        ele.empty();
        for (var key in data) {
            ele.append(
                ` <tr>
                        <td>
                            ` + data[key].nickname + `
                        </td>
                        <td>
                            ` + data[key].email + `
                        </td>
                        <td>
                            ` + data[key].createdTime + `
                        </td>
                        <td class="admin_operate">
                            <input type="hidden" value="` + data[key]._id + `" class="user_id">
                            <a href="javascript:;" class="btn btn-xs btn-default user_gag ">禁言</a>
                        </td>
                    </tr>
                    `
            );
        }
        ele.find('.admin_operate').each(function () {
            $(this).find('.user_gag').on('click', function () {
                var user_id = $(this).parents('.admin_operate')
                    .find('.user_id').val()
                    .replace(/"/g, '');
                $.get('/admin/gag', {
                    user_id: user_id
                });
                // 清除当前元素
                $(this).parents('tr').remove();
                normalUserNumber--;
                limitUserNumber++;
                normalUserEle.text('正常用户：' + normalUserNumber + ';');
                limitUserEle.text('禁言用户：' + limitUserNumber + ';');
            });
        });
    }

    // 恢复权限函数
    function onRestoreChange(ele, data) {
        ele.empty();
        for (var key in data) {
            ele.append(
                ` <tr>
                        <td>
                            ` + data[key].nickname + `
                        </td>
                        <td>
                            ` + data[key].email + `
                        </td>
                        <td>
                            ` + data[key].createdTime + `
                        </td>
                        <td class="admin_operate">
                            <input type="hidden" value="` + data[key]._id + `" class="user_id">
                            <a href="javascript:;" class="btn btn-xs btn-primary cancel_gag_operate">取消禁言</a>
                        </td>
                    </tr>
                    `
            );
        }
        ele.find('.admin_operate').each(function () {
            $(this).find('.cancel_gag_operate').on('click', function () {
                var user_id = $(this).parents('.admin_operate').find('.user_id').val()
                    .replace(/"/g, '');
                $.get('/admin/cancel_gag', {
                    user_id: user_id
                });
                // 清除当前元素
                $(this).parents('tr').remove();
                $(this).parents('tr').remove();
                normalUserNumber++;
                limitUserNumber--;
                normalUserEle.text('正常用户：' + normalUserNumber + ';');
                limitUserEle.text('禁言用户：' + limitUserNumber + ';');
            });
        });
    }

    // 管理员搜索帖子
    $('#admin_search').on('submit', function (e) {
        // 阻止默认提交方式
        e.preventDefault()
        // 序列化表单值，创建 URL 编码文本字符串。
        var formData = $(this).serialize();
        $.ajax({
            url: '/admin_search',
            type: 'get',
            data: formData,
            dataType: 'json',
            success: function (data) {
                $('#wrap1').remove();
                onTopicChange($('#admin_topic'), data);
            }
        });
    });

    // 管理员搜索用户
    $('#user_search').on('submit', function (e) {
        // 阻止默认提交方式
        e.preventDefault()
        // 序列化表单值，创建 URL 编码文本字符串。
        var formData = $(this).serialize();
        $.ajax({
            url: '/user_search',
            type: 'get',
            data: formData,
            dataType: 'json',
            success: function (data) {
                onUserChange($('#admin_user'), data);
            }
        });
    });
    
});