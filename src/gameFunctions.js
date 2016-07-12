/**
 * Created by chenzhaowen on 16/4/20.
 */
var gfun = gfun || {};

gfun.checkHasItemByTable = function(t,itemId,idx) {
    if (t == null) {
        return false;
    }
    for (var i in t) {
        if (t[i][idx] == itemId) {
            return true;
        }
    }
    return false;
};