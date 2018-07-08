var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var querystring = require('querystring');
var fs = require('fs');
var menu = require('./menuConfig.json')

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || '3978', function () {
    console.log('%s listening to %s', server.name, server.url)
});

var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function (session) {

        // Welcome Page
        var card = new builder.VideoCard(session)
            .title('UMF Yogurt CO., LTD')
            .subtitle('by the AIEN02-Manufacturing group')
            .text('Chobani® Smooth non-Greek yogurt: a variety of classic flavors at the perfect value.')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
            .media([
                { url: 'https://www.youtube.com/watch?v=au8lGDV-1Es' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, "http://localhost:8000/", "Learn more")
            ])
            // .autostart(true)
            ;

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.replaceDialog("Login");
    }
]);

bot.dialog('Login', [
    function (session, args) {
        var prompText;
        if (args == "failed") {
            promptText = "請重新輸入";
        } else {
            var promptText = "歡迎來到Greek優格工廠管理系統。請輸入您的id密碼以供我驗證身分。";
        }
        builder.Prompts.text(session, promptText);
    },
    function (session, results) {
        var pwd = results.response;
        var options = {
            method: 'GET',
            url: 'http://localhost:8000/api/employees/'
        };
        request(options, function (error, response, body) {
            var employees = JSON.parse(body);
            var confirmed = 0;
            for (i = 0; i < employees.length; i++) {
                if (employees[i].postalcode == pwd) {
                    session.send("身分確認");
                    session.send(`早安, **${employees[i].titleofcourtesy} ${employees[i].firstname} ${employees[i].lastname}**`);
                    var confirmed = 1;
                    break;
                }
            }
            if (!confirmed) {
                session.endDialog("身分驗證失敗");
                session.replaceDialog("Login", "failed");
            } else {
                session.userData.identity = employees[i].employeeid;
                session.userData.nameandtitle = employees[i].titleofcourtesy + " " + employees[i].firstname + " " + employees[i].lastname;
                session.replaceDialog("Main menu")
            }
        })
    }
]).triggerAction({
    matches: /Login/i
});

bot.dialog('Main menu', [
    function (session) {
        var identity = session.userData.identity;
        if (identity == 0) {
            session.replaceDialog("Login")
        } else if (identity == 2) {
            builder.Prompts.choice(session, "請選擇管理系統",menu.Menu, { listStyle: builder.ListStyle.button });
        } else if (identity == 5) {
            builder.Prompts.choice(session, "請選擇管理系統",menu.Menu, { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, "請選擇管理系統",menu.Menu, { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        session.beginDialog(menu.Menu[results.response.entity]);
    }
]).triggerAction({
    matches: /Main menu/i
});

bot.dialog("Log out", function (session) {
    session.userData.identity = 0;
    session.endDialog(`系統已登出。 祝您有美好的一天, **${session.userData.nameandtitle}**.`);
}).triggerAction({
    matches: /Log out/i
});

// file is included here:
eval(fs.readFileSync('agvs.js').toString());
eval(fs.readFileSync('orders.js').toString());
eval(fs.readFileSync('task.js').toString());
eval(fs.readFileSync('products.js').toString());