$(function () {
    // 修改个人信息
    $('#profile_form').on('submit', function (e) {
        // 阻止表单的默认提交方式
        e.preventDefault();
        // 序列化表单值
        var formData = $(this).serialize();
        $.ajax({
            url: '/setting/profile',
            type: 'post',
            dataType: 'json',
            data: formData,
            success: function (data) {
                var err_code = data.err_code;
                if (err_code === 0) {
                    window.alert('修改成功')
                    // 服务端重定向针对异步请求无效 所以必须使用客户端自己重定向
                    window.location.reload();
                } else if (err_code === 1) {
                    window.alert('输入的昵称为空！');
                } else if (err_code === 2) {
                    window.alert('该昵称已被占用！');
                } else if (err_code === 500) {
                    window.alert('服务器忙，请稍后重试！');
                }
            }
        });
    });

    // 选中性别
    var gender = $('#userGender').val();
    $('#genderBox').find('input').each(function () {
        if ($(this).val() === gender) {
            $(this).attr("checked", "checked");
        }
    });
});