// Modules import ====================================================================
var restify = require('restify')
var builder = require('botbuilder')
var request = require('request')
var server = restify.createServer()
var menu = require('./menuConfig.json')
var orders = menu.orders
// ==================================================================================
// Dialog function of 機器人 ==========================================================
// Car variable
var works = []
var rests = []
var fixs = []
var bats = []
var whoworking = []
var whoresting = []
var whofixing = []
var whobating = []
var cars
var car
var carapi = {
    method: "GET",
    url: "http://localhost:8000/api/drivelesscar/?format=json"
}
request(carapi, function (error, response, body) {
    car = JSON.parse(body)
    for (i = 0; i < car.length; i++) {
        work = car[i].status
        id = car[i].carid
        if (work == '工作中') {
            works.push(work)
            whoworking.push(id)
        } else if (work == '休眠中') {
            rests.push(work)
            whoresting.push(id)
        } else if (work == '維修中') {
            fixs.push(work)
            whofixing.push(id)
        } else if (work == '待充電') {
            bats.push(work)
            whobating.push(id)
        }
    }
})
var caramount = /.*數量.*/
var working = /.*工作中.*/
var resting = /.*休眠中.*/
var fixing = /.*維修中.*/
var bating = /.*待充電中.*/
var whowork = /.*哪幾台.*工作.*/
var whorest = /.*哪幾台.*休眠.*/
var whofix = /.*哪幾台.*維修.*/
var whobat = /.*哪幾台.*待充電.*/

function showTime() {
    var options = {
        method: "GET",
        url: "http://localhost:8000/api/drivelesscar/?format=json"
    }
    request(options, function (error, response, body) {
        car = JSON.parse(body)
        cars = car
    })
    setTimeout(function () {
        for (i = 0; i < car.length - 1; i++) {
            if (cars[i].status == "工作中") {
                battery = cars[i].battery.split("%")[0]
                if (battery <= 5) {
                    var options = {
                        method: "PUT",
                        url: "http://localhost:8000/api/drivelesscar/" + cars[i].id + "/",
                        headers: { 'content-type': 'application/json' },
                        body: {
                            id: cars[i].id,
                            carid: cars[i].id + "號",
                            status: "待充電",
                            battery: "0%"
                        },
                        json: true
                    }
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("ok")
                        } else {
                            console.log("no")
                        }
                    })
                }
                else {
                    var options = {
                        method: "PUT",
                        url: "http://localhost:8000/api/drivelesscar/" + car[i].id + "/",
                        headers: { 'content-type': 'application/json' },
                        body: {
                            id: car[i].id,
                            carid: car[i].id + "號",
                            status: car[i].status,
                            battery: (battery - 5) + "%"
                        },
                        json: true
                    }
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("ok")
                        } else {
                            console.log("no")
                        }
                    })
                }
            } else {
                continue
            }
        }
    }, 50)
}
setInterval(function () {
    showTime()
}, 179950)
// Startcar====================================================================
bot.dialog('carMenu', [
    function (session, args) {
        var promptText
        var msg = new builder.Message(session)
        if (args && args.reprompt) {
            promptText = "請問您還要問什麼問題嗎?"
        }
        else {
            promptText = "您進入的是無人車查詢頁面，請問您想要問什麼問題呢?"
            session.conversationData.orders = new Array()
        }
        builder.Prompts.text(session, promptText)
        msg.suggestedActions(builder.SuggestedActions.create(
            session, [
                builder.CardAction.imBack(session, "查詢電池", "查詢電池"),
                builder.CardAction.imBack(session, "新增/修改/刪除", "新增/修改/刪除"),
                builder.CardAction.imBack(session, "離開", "離開")
            ]
        ))
        session.send(msg)
    },
    function (session, results) {
        if ((results.response).match(caramount)) {
            session.send("無人車的數量有" + car.length + "台")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(working)) {
            session.send("現在有" + works.length + "台在工作中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(bating)) {
            session.send("現在有" + bats.length + "台待充電中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(resting)) {
            session.send("現在有" + rests.length + "台在休眠中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(fixing)) {
            session.send("現在有" + fixs.length + "台在維修中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(whowork)) {
            session.send("現在有" + whoworking + "在工作中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(whorest)) {
            session.send("現在有" + whoresting + "在休眠中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(whofix)) {
            session.send("現在有" + whofixing + "在維修中")
            session.replaceDialog("carMenu", { reprompt: true })
        }
        else if ((results.response).match(whobat)) {
            if (whobating.length == 0) {
                session.send("現在沒有車待充電中")
                session.replaceDialog("carMenu", { reprompt: true })
            } else {
                session.send("現在有" + whobating + "待充電")
                session.replaceDialog("carMenu", { reprompt: true })
            }
        }
        else if (results.response == '查詢電池') {
            session.replaceDialog("battery")
        }
        else if (results.response == '新增/修改/刪除') {
            session.replaceDialog("carstatus")
        }
        else if (results.response == '離開') {
            session.send("掰掰")
            session.replaceDialog('Main menu', { reprompt: true })
        }
        else {
            session.send("抱歉，我找不到這個問題")
            session.replaceDialog("carMenu", { reprompt: true })
        }
    }
])

bot.dialog("battery", [
    function (session) {
        builder.Prompts.number(session, "您要查詢幾號車的電池狀態呢?")
    },
    function (session, results) {
        for (i = 0; i < car.length; i++) {
            id = car[i].carid.split("號")[0]
            battery = car[i].battery
            if (results.response == id) {
                session.send(battery)
            }
        }
        session.replaceDialog("carMenu", { reprompt: true })
    }
])

bot.dialog("carstatus", [
    function (session) {
        builder.Prompts.choice(session, "請選擇您想要做的動作", "新增|刪除|修改", { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        if (results.response.entity == "新增") {
            session.beginDialog("caradd")
        } else if (results.response.entity == "刪除") {
            session.beginDialog("cardelete")
        } else if (results.response.entity == "修改") {
            session.beginDialog("carupdate")
        }
    }
])

bot.dialog("carupdate", [
    function (session) {
        builder.Prompts.number(session, "您想要修改哪一號車的狀態呢")
    },
    function (session, results) {
        session.dialogData.number = results.response
        carid = session.dialogData.number
        for (i = 0; i < car.length; i++) {
            id = car[i].carid.split("號")[0]
            if (results.response == id) {
                if (car[i].status == "工作中") {
                    session.send(id + "號車現在的狀態是工作中")
                    builder.Prompts.choice(session, "您想要修改成什麼狀態?", "休眠中|維修中")
                } else if (car[i].status == "休眠中") {
                    session.send(id + "號車現在的狀態是休眠中")
                    builder.Prompts.choice(session, "您想要修改成什麼狀態?", "工作中|維修中")
                } else if (car[i].status == "維修中") {
                    session.send(id + "號車現在的狀態是維修中")
                    builder.Prompts.choice(session, "您想要修改成什麼狀態?", "工作中|休眠中")
                } else {
                    session.endDialog(id + "號車現在需要充電")
                    session.replaceDialog("carMenu", { reprompt: true })
                }
            }
        }
    },
    function (session, results) {
        for (i = 0; i < car.length; i++) {
            if (car[i].id == carid) {
                var options = {
                    method: "PUT",
                    url: "http://localhost:8000/api/drivelesscar/" + carid + "/",
                    headers: { 'content-type': 'application/json' },
                    body: {
                        id: carid,
                        carid: carid + "號",
                        status: results.response.entity,
                        battery: car[i].battery
                    },
                    json: true
                }
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        session.send("修改成功")
                        session.replaceDialog("carMenu", { reprompt: true })
                    } else {
                        session.send("修改失敗")
                        session.replaceDialog("carMenu", { reprompt: true })
                    }
                })
            }
        }
    }
])

bot.dialog("caradd", [
    function (session) {
        builder.Prompts.number(session, "請問您想要新增幾台車？")
    },
    function (session, results) {
        cars = []
        last = car.length
        session.dialogData.carnumber = results.response
        for (i = 1; i < session.dialogData.carnumber + 1; i++) {
            carnum = (last + i) + "號"
            cars.push(carnum)
        }
        builder.Prompts.choice(session, "您確定要新增" + cars + "車嗎？", "確定|取消")
    },
    function (session, results) {
        if (results.response.entity == "確定") {
            var a = 0
            for (i = 1; i < session.dialogData.carnumber + 1; i++) {
                var options = {
                    method: "POST",
                    url: "http://localhost:8000/api/drivelesscar/",
                    headers: { 'content-type': 'application/json' },
                    body: {
                        id: last + i,
                        carid: (last + i) + "號",
                        status: "休眠中",
                        battery: '100%'
                    },
                    json: true
                }
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 201) {
                        a = a + 1
                        console.log(a)
                    } else {
                        session.send("新增失敗")
                        session.replaceDialog("carMenu", { reprompt: true })
                    }
                })
            }
            setTimeout(function () {
                console.log(a)
                if (a == session.dialogData.carnumber) {
                    session.send("新增成功")
                }
                session.replaceDialog("carMenu", { reprompt: true })
            }, 500)
        } else {
            session.replaceDialog("carMenu", { reprompt: true })
        }
    }

])

bot.dialog("cardelete", [
    function (session) {
        builder.Prompts.number(session, "請問您想刪除哪一號車？")
    },
    function (session, results) {
        var options = {
            method: "DELETE",
            url: "http://localhost:8000/api/drivelesscar/" + results.response + "/",
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 204) {
                session.send("刪除成功")
                session.replaceDialog("carMenu", { reprompt: true })
            } else {
                session.send("刪除失敗")
                session.replaceDialog("carMenu", { reprompt: true })
            }
        })
    }
])
// Endcar ======================================================================
// End Dialog function of 機器人 ================================================