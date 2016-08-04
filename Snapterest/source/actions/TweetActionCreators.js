/**
 * Created by chinghsu on 16/8/4.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
function receiveTweet(tweet) {
    var action = {
        type: 'receive_tweet',
        tweet: tweet
    };
    AppDispatcher.dispatch(action);
}

module.exports = {
    receiveTweet: receiveTweet
};