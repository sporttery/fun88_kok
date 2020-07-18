//导入依赖包
const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");
const config = require("./config");
const superagent = require("superagent");
const cheerio = require("cheerio");


function doLogin(){
    console.log("需要登录");
}

function initData(data){
    // console.log(data);
    data = data.Data;
    let matchList = data.NewMatch;
    let teamNameMap = data.TeamN;
    let leagueNameMap = data.LeagueN;
    for(var i=0;i<matchList.length;i++){
        let match = matchList[i];
        let leagueId = match.LeagueId;
        let homeTeamId = match.TeamId1;
        let awayTeamId = match.TeamId2;
        let homeName = teamNameMap[homeTeamId].split("|")[0];
        let awayName = teamNameMap[awayTeamId].split("|")[0];
        let leagueName = leagueNameMap[leagueId].split("|")[0];
        let gameTime = match.GameTime;
        let d = new Date(gameTime);
        let timePart = gameTime.split(/[-T:]/);
        let d1 = Date.UTC(parseInt(timePart[0]),parseInt(timePart[1]-1),parseInt(timePart[2]),parseInt(timePart[3]),parseInt(timePart[4]),parseInt(timePart[5]),0);
        console.log(leagueName,homeName,awayName,gameTime,d.toLocaleString(),d1.toLocaleString());
    }
}

function main(){

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
                    initData(data);
                } else if (data.ErrorCode == 100) {
                    doLogin()
                }
            } else {
                console.log(response.text);
            }
        });　　
}


main();