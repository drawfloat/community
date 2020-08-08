// 帐号操作
$(function () {
    // 前端先进行一部分验证操作
    $('#account_form>button').on('click', function () {
        var current_password = $('#current_password').val();
        var new_password = $('#new_password').val();
        var confirm_password = $('#confirm_password').val();
        // 如果当前密码为空
        if (!current_password) {
            window.alert('当前密码为空');
            // 密码小于六位数
        } else if (new_password.length < 6) {
            window.alert('新密码小于6位数');
        } else if (new_password === current_password) {
            window.alert('当前密码和新密码重复');
        } else if (new_password !== confirm_password) {
            window.alert('确认密码错误');
        } else {
            // 修改密码请求
            $('#account_form').on('submit', function (e) {
                e.preventDefault();
                var formData = $(this).serialize();
                $.ajax({
                    url: '/setting/account',
                    type: 'post',
                    data: formData,
                    dataType: 'json',
                    success: function (data) {
                        var err_code = data.err_code;
                        if (err_code === 0) {
                            window.alert('密码修改成功，请重新登录');
                            // 服务端重定向针对异步请求无效 所以必须使用客户端自己重定向
                            window.location.href = '/login';
                        } else if (err_code === 1) {
                            window.alert('当前密码错误');
                        } else if (err_code === 500) {
                            window.alert('服务器忙，请稍后重试！');
                        }
                    }
                });
            });
        }
    });

    // 删除帐号操作
    $('#delete_account').on('click', function () {
        $.get('/account/delete', {
            user_id: `{{user._id}}`
        }, function (data, status) {
            if (data.err_code === 0) {
                window.alert('帐号已注销!');
                window.location.href = '/';
            }
        });

    });
});