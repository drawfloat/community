var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var topTopicSchema = new Schema({
    //帖子id 
    topicId: {
        type: String,
        required: true
    },
    // 作者id
    authorId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TopTopic', topTopicSchema);