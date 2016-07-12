/**
 * Created by Fizzo on 16/5/11.
 */

var cryptoHelper = {}

var IamNotkey = "8567b3775db070c8"
var meToo = "hehehe"

/**
 * http加密
 * @param {object} data
 * @return {string} newData
 */
cryptoHelper.cryptoHttpData = function(data) {
    //--先进行xxtea加密
    data = xxtea.encrypt(data, IamNotkey)
    //--再用base64转换
    data = Base64.encode(data)

    var newData = {}
    newData.m = data
    newData = JSON.stringify(newData)
    return newData;
}
/**
 * 解密
* @param {object} data
* @param {string} key [key=8567b3775db070c8]
* @return {string} data
*/
cryptoHelper.decryptoDataByKey = function(data,key) {
    key = key || meToo
    data = Base64.decode(data)
    data = xxtea.decrypt(data, key)
    return data
}

/**
 * 加密
 * @param {object} data
 * @param {string} key [key=8567b3775db070c8]
 * @return {string} data
 */
cryptoHelper.cryptoDataByKey = function(data,key) {
    key = key || meToo
    //--先进行xxtea加密
    data = xxtea.encrypt(data, key)
    //--再用base64转换
    data =  Base64.encode(data)
    return data
}
