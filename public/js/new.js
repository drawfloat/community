// 发表帖子
$('#new_topic_form').on('submit', function (e) {
    // 阻止默认提交方式
    e.preventDefault()
    // 序列化表单值，创建 URL 编码文本字符串。
    /*
    FirstName=Bill&LastName=Gates
    */
    var formData = $(this).serialize();
    $.ajax({
        url: '/topic/new',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
            var err_code = data.err_code,
                topic_id = data.topic_id;
            if (err_code === 0) {
                window.alert('发表成功')
                // 服务端重定向针对异步请求无效 所以必须使用客户端自己重定向
                window.location.href = '/topic/read?topic_id=' + topic_id;
            } else if (err_code === 1) {
                window.alert('标题或内容为空');
            } else if (err_code === 2) {
                window.alert('您已被限制发言！');
            } else if (err_code === 500) {
                window.alert('服务器忙，请稍后重试！');
            }
        }
    });
});