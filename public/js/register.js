// 注册
$(function () {
    $('#register_form').on('submit', function (e) {
        // 阻止默认提交方式
        e.preventDefault()
        // 序列化表单值，创建 URL 编码文本字符串。
        /* 
            FirstName=Bill&LastName=Gates
        */
        var formData = $(this).serialize();
        $.ajax({
            url: '/register',
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (data) {
                var err_code = data.err_code;
                if (err_code === 0) {
                    window.alert('注册成功！');
                    // 服务端重定向针对异步请求无效 所以必须使用客户端自己重定向
                    window.location.href = '/';
                } else if (err_code === 1) {
                    window.alert('邮箱或昵称为空！');
                } else if (err_code === 2) {
                    window.alert('密码长度小于6位！');
                } else if (err_code === 3) {
                    window.alert('邮箱或昵称被占用！');
                } else if (err_code === 500) {
                    window.alert('服务器忙，请稍后重试！');
                }
            }
        });
    });
});