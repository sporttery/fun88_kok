//导入依赖包
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");
let cStart = require('child_process');
const os = require("os")
const config = require("./config");
const superagent = require("superagent");
const cheerio = require("cheerio");
const Puppeteer = require('puppeteer-core');




function printInfo(ck) {
    console.log("\n######################################################################\n" +
        "######################################################################\n" +
        "########                                                      ########\n" +
        "########                       程序已" + ck + "                     ########\n" +
        "########          技术指导电话(微信)：张工 13714608818        ########\n" +
        "########          技术指导电话(微信)：张工 13714608818        ########\n" +
        "########          技术指导电话(微信)：张工 13714608818        ########\n" +
        "########          技术指导电话(微信)：张工 13714608818        ########\n" +
        "########          技术指导电话(微信)：张工 13714608818        ########\n" +
        "########                                                      ########\n" +
        "######################################################################\n" +
        "######################################################################\n");
    if (ck == "退出") {
        process.exit();
    }
}

let g_data = {};

function initData_fun88(data) {
    // console.log(data);
    data = data.Data;
    let matchList = data.NewMatch;
    let teamNameMap = data.TeamN;
    let leagueNameMap = data.LeagueN;
    let timestamp = new Date().getTime();
    let timestamp_diff = 1000 * 60 * 60 * 12;
    for (var i = 0; i < matchList.length; i++) {
        let match = matchList[i];
        let matchId = match.MatchId;
        let matchCode = match.MatchCode;
        let leagueId = match.LeagueId;
        let homeTeamId = match.TeamId1;
        let awayTeamId = match.TeamId2;
        let homeName = teamNameMap[homeTeamId].split("|")[0];
        let awayName = teamNameMap[awayTeamId].split("|")[0];
        let leagueName = leagueNameMap[leagueId].split("|")[0];
        let gameTime = match.GameTime;
        let playTime = new Date(new Date(gameTime).getTime() + timestamp_diff);
        if (playTime < timestamp) {

            continue;

        }
        let matchObj = { matchId, matchCode, leagueId, homeTeamId, awayTeamId, leagueName, homeName, awayName, gameTime, playTime };
        // let matchObj = { leagueName, homeName, awayName, playTime,match };
        if (leagueName.indexOf("虚拟赛") != -1) {
            continue;
        }
        g_data["_" + matchId] = matchObj;
        // console.log(JSON.stringify(matchObj ));
        superagent
            .post(config.fun88_url_getMarket)
            .set(config.header_fun88)
            .send({
                "GameId": "1",
                "DateType": "t",
                "BetTypeClass": "OU",
                "Matchid": matchId
            })
            .end((error, response) => {
                if (error) {
                    console.log(error)
                    console.log(leagueName, homeName, awayName, playTime, "抓取失败");
                    return;
                }
                let data = response.body;
                if (data) {
                    if (data.ErrorCode == 0) {
                        let oddsList = data.Data.NewOdds;
                        let matchId = oddsList[0].MatchId;
                        g_data["_" + matchId].oddsList = oddsList;
                    } else if (data.ErrorCode == 100) {
                        console.log("获取赔率失败 cookie");
                    }
                } else {
                    console.log(response.text);
                }
            });
    }
}


function getData_fun88() {
    console.log("开始抓取fun88的数据");
    superagent
        .post(config.fun88_data_url)
        .set(config.header_fun88)
        .send({
            "GameId": "1",
            "DateType": "t",
            "BetTypeClass": "OU"
        })
        .end((error, response) => {
            if (error) {
                console.log(error)
                return;
            }
            let data = response.body;
            if (data) {
                if (data.ErrorCode == 0) {
                    initData_fun88(data);
                } else if (data.ErrorCode == 100) {
                    // doLogin()
                    console.log("需要登录，请重新设置 cookie");
                }
            } else {
                console.log(response.text);
            }
        });
}

function initData_kok(data) {
    //IsFirstLoad: false
    // VersionH: 1:0,2:0,3:0,4:0,7:0,13:0,20:0,21:0,23:0,26:0
    // IsEventMenu: false
    // SportID: 1
    // CompetitionID: -1
    // reqUrl: /m/zh-cn/sports/football/matches-by-date/today/full-time-asian-handicap-and-over-under?competitionids=28485
    // IsMobile: true
    // oCompetitionId: 0
    // oEventIds: 0
    // oIsFirstLoad: false
    // oPageNo: 0
    // oSortBy: 1
    // LiveCenterEventId: 0
    // LiveCenterSportId: 1
    for (var i = 0; i < data.mod.cm.length; i++) {
        let contry = data.mod.cm[i];//国家
        let leagueArr = contry.c;//赛事
        for (var j = 0; j < leagueArr.length; j++) {
            let league = leagueArr[j];
            let leagueName = league.n;
            let leagueId = league.id;
            superagent
                .post(config.kok_data_url)
                .set(config.header_kok)
                .send({
                    "IsFirstLoad": "true",
                    "VersionH": "1:0,2:0,3:0,4:0,7:0,13:0,20:0,21:0,23:0,26:0",
                    "IsEventMenu": "false",
                    "SportID": 1,
                    "CompetitionID": -1,
                    "reqUrl": "/m/zh-cn/sports/football/select-competition/default?date=today",
                    "IsMobile": "true",
                    "oCompetitionId": 0,
                    "oEventIds": 0,
                    "oIsFirstLoad": "true",
                    "oPageNo": 0,
                    "oSortBy": 1,
                    "LiveCenterEventId": 0,
                    "LiveCenterSportId": 1
                })
                .end((error, response) => {
                    if (error) {
                        console.log(error)
                        return;
                    }
                    // console.log(response.text);
                    // console.log(response.body);
                    let data = response.body;
                    if (data) {
                        data = data.mod.cm || data.mod.d;
                        if (data.mod && data.mod.cm && data.mod.cm.length > 0) {
                            initData_kok(data);
                        } else {
                            // doLogin()
                            console.log("需要登录，请重新设置 cookie");
                        }
                    } else {
                        console.log("获取数据失败 请重新设置 cookie");
                        console.log(response.text);
                    }
                });
        }
    }

}

function getData_kok() {
    console.log("开始抓取kok的数据");
    superagent
        .post(config.kok_data_url)
        .set(config.header_kok)
        .send({
            "IsFirstLoad": "true",
            "VersionH": "1:0,2:0,3:0,4:0,7:0,13:0,20:0,21:0,23:0,26:0",
            "IsEventMenu": "false",
            "SportID": 1,
            "CompetitionID": -1,
            "reqUrl": "/m/zh-cn/sports/football/select-competition/default?date=today",
            "IsMobile": "true",
            "oCompetitionId": 0,
            "oEventIds": 0,
            "oIsFirstLoad": "true",
            "oPageNo": 0,
            "oSortBy": 1,
            "LiveCenterEventId": 0,
            "LiveCenterSportId": 1
        })
        .end((error, response) => {
            if (error) {
                console.log(error)
                return;
            }
            // console.log(response.text);
            // console.log(response.body);
            let data = response.body;
            if (data) {
                data = data.mod .cm ;
                if (data && data.length > 0) {
                    initData_kok(data);
                } else {
                    // doLogin()
                    console.log("需要登录，请重新设置 cookie");
                }
            } else {
                console.log("获取数据失败 请重新设置 cookie");
                console.log(response.text);
            }
        });
}

function main() {
    printInfo("启动");

    // getData_fun88();

    getData_kok();

}


main();