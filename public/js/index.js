$(function () {
    // 分页
    var onPagechange = function (currentPage) {
        $.get('/pagination', {
            currentPage: currentPage,
            pagesize: `{{page.pagesize}}`
        }, function (data, status, xhr) {
            if (status === 'success') {
                $('#topicBox').empty();
                for (var key in data) {
                    $('#topicBox').append(
                        `
                        <div class="media col-md-10 column">
                    <a href="/personal/personal?personal_id=` + data[key].authorId + `"
                        class="pull-left">
                        <img src="/public/img/default4.jpg" class="media-object" alt='' /></a>
                    <div class="media-body">
                        <h3 class="media-heading">
                            <a class="text-success"
                                href="/topic/read?topic_id=` + data[key]._id + `">` + data[key].author +
                        `</a>
                        </h3>
                        <p class="text-left text-warning limit_length">
                            {{$value.title}}
                            < span class = "pull-right text-success" > ` + data[key].createdTime + ` < /span>
                        </p>
                    </div>
                </div>
                <span class="action pull-right starBox">
                    <a href="javascript:;"><i
                            class="glyphicon glyphicon-star pull-right">&nbsp;` + data[key].starNumber + `</i></a>
                </span>
                        `);
                }
            }
        });
    }
    var obj = {
        wrapid: 'wrap1', //页面显示分页器容器id
        total: `{{page.total}}`, //总条数
        pagesize: `{{page.pagesize}}`, //每页显示10条
        currentPage: 1, //当前页
        onPagechange: onPagechange
        //btnCount:7 页数过多时，显示省略号的边界页码按钮数量，可省略，且值是大于5的奇数
    }
    pagination.init(obj);
});