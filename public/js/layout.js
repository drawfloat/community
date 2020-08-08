// 搜索帖子
$(function () {
    $('#topic_search').on('submit', function (e) {
        // 阻止默认提交方式
        e.preventDefault()
        // 序列化表单值，创建 URL 编码文本字符串。
        var formData = $(this).serialize();
        $.ajax({
            url: '/topic_search',
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (data) {
                if (data.length === 0) {
                    window.alert('搜索帖子不存在！')
                } else {
                    $('.search_delete').empty();
                    $('#topicBox').empty();
                    for (var key in data) {
                        $('#topicBox').append(
                            `
                                 <div class="media  col-md-10 column">
                                     <a href="/personal/personal?personal_id=` + data[key].authorId + `"
                                         class="pull-left"><img src="/public/img/default4.jpg" class="media-object"
                                             alt='' /></a>
                                     <div class="media-body">
                                         <h3 class="media-heading">
                                             <a class="text-success" href="/topic/read?topic_id=` + data[key]._id +
                            `">` +
                            data[key].author +
                            `</a>
                                         </h3>
                                         <p class="text-left">` + data[key].title + `
                                            <br>
                                            <span class="pull-right">` + data[key].createdTime + `</span>
                                        </p>
                                     </div>
                                 </div>
                                 <span class="action pull-right starBox">
                                     <a href="javascript:;"><i class="glyphicon glyphicon-star
                                                pull-right">&nbsp;` + data[key].starNumber + `</i></a>
                                 </span>
                                 `
                        );
                    }
                }

            }
        });
    });
});