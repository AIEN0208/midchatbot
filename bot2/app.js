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
            promptText = "Please try again.";
        } else {
            var promptText = "Welcom to the UMF management system. Please let me check your identification.(pwd: **98401**)";
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
            console.log(employees[0].employeeid);
            for (i = 0; i < employees.length; i++) {
                if (employees[i].postalcode == pwd) {
                    session.send("Identity confirmed");
                    session.send(`Welcome aboard, **${employees[i].titleofcourtesy} ${employees[i].firstname} ${employees[i].lastname}**`);
                    var confirmed = 1;
                    break;
                }
            }
            if (!confirmed) {
                session.endDialog("Authentication failed.");
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
            builder.Prompts.choice(session, "Here are the authorities you have.", "AGV manage system|Order inquiry system|Task management|Function4|Log out", { listStyle: builder.ListStyle.button });
        } else if (identity == 5) {
            builder.Prompts.choice(session, "Here are the authorities you have.", "AGV manage system|Order inquiry system|Task management|Function4|Log out", { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, "Here are the authorities you have.", "AGV manage system|Order inquiry system|Task management|Function4|Log out", { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        session.beginDialog(menu.engMenu[results.response.entity]);
    }
]).triggerAction({
    matches: /Main menu/i
});

// file is included here:
eval(fs.readFileSync('agvs.js').toString());
eval(fs.readFileSync('orders.js').toString());
eval(fs.readFileSync('task.js').toString());
// eval(fs.readFileSync('Function4.js').toString());