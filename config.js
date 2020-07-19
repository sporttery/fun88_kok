const fs = require("fs");
const cookie_fun88 = fs.readFileSync("cookie_fun88.txt").toString();
const cookie_kok = fs.readFileSync("cookie_kok.txt").toString();
const userAgent  = "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3882.0 Mobile Safari/537.36";

const header_fun88 = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Length": "35",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Cookie": cookie_fun88,
    "Host": "ismart.fafafahuat.com",
    "Origin": "https://ismart.fafafahuat.com",
    "Referer": "https://ismart.fafafahuat.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "uid": "AB88RMB018268",
    "User-Agent": userAgent,
    "X-Requested-With": "XMLHttpRequest"
}


const header_kok = {

    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "User-Agent": userAgent,
    "referrer": "https://xj-mbs-yb5.2r9qgy.com/m/zh-cn/sports/football/select-competition/default?sc=ABIBAI&theme=YB5",
    "referrerPolicy": "no-referrer-when-downgrade",
    "cookie": cookie_kok
}



const fun88_data_url = "https://ismart.fafafahuat.com/Odds/ShowAllOdds";
const fun88_url_getMarket = "https://ismart.fafafahuat.com/Odds/GetMarket";


const kok_data_url = "https://xj-mbs-yb5.2r9qgy.com/zh-cn/Service/CentralService?GetData&ts=1595063492728";


module.exports = {
    fun88_data_url, kok_data_url, header_fun88, header_kok,userAgent,fun88_url_getMarket
}

