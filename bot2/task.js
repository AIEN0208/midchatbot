var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var querystring = require('querystring');
var menu = require('./menuConfig.json')

var options = {
    method: 'GET',
    url: 'http://localhost:8000/api/employees/'
};
request(options, function (error, response, body) {
    employees = JSON.parse(body);
})

var options = {
    method: 'GET',
    url: 'http://localhost:8000/api/employeestask/'
};
request(options, function (error, response, body) {
    employeestask = JSON.parse(body);
})

bot.dialog('Task management', [
    function (session) {
        builder.Prompts.choice(session, "Select a function below.", "Clock-in & Daily Plan|Work Time Confirmation|Work Reports|Efficiency Report", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        var choice = results.response.entity;
        session.replaceDialog(choice);
    }
]).triggerAction({
    matches: /Task management/i
});

bot.dialog("Clock-in & Daily Plan", [
    function (session) {
        var id = session.userData.identity;
        var cards = [];
        for (i = 0; i < employees.length; i++) {
            if (employees[i].reportsto == id) {
                var task = "";
                var employeeid = employees[i].employeeid
                for (j = 0; j < employeestask.length; j++) {
                    if (employeestask[j].employeeid == employeeid) {
                        if (employeestask[j].job) {
                            task += (`• ${employeestask[j].job} <br/>`);
                        }
                    }
                }
                var card =
                    new builder.AnimationCard(session)
                        .title(`${employees[i].titleofcourtesy} ${employees[i].firstname} ${employees[i].lastname}`)
                        .subtitle(`Department: ${employees[i].department}<br/>position: ${employees[i].position}`)
                        .text(task)
                        .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
                        .media([
                            { url: `${employees[i].photopath}` }
                        ])
                    ;
                cards.push(card);
            }
        }
        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards)
            .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Assign jobs", "Assign jobs"),
                    builder.CardAction.imBack(session, "Cancel jobs", "Cancel jobs"),
                    builder.CardAction.imBack(session, "Task management", "Task management"),
                    builder.CardAction.imBack(session, "Main menu", "Main menu"),
                ]
            ))
            ;
        session.send(reply);
    },
]).triggerAction({
    matches: /Clock-in & Daily Plan/i
});

bot.dialog("Work Time Confirmation", function (session) {
    session.send("Sorry, we are still working on it.");
    session.replaceDialog("Task management");
});

bot.dialog('Work Reports', [
    function (session) {
        var id = session.userData.identity;
        var cards = [];
        for (i = 0; i < employees.length; i++) {
            if (employees[i].reportsto == id) {
                var task = "";
                var employeeid = employees[i].employeeid
                for (j = 0; j < employeestask.length; j++) {
                    if (employeestask[j].employeeid == employeeid) {
                        if (employeestask[j].dailyreport) {
                            task += (`• ${employeestask[j].dailyreport} <br/>`);
                        }
                    }
                }
                var card =
                    new builder.ThumbnailCard(session)
                        .title(`${employees[i].titleofcourtesy} ${employees[i].firstname} ${employees[i].lastname}`)
                        .subtitle(`Department: ${employees[i].department}<br/>position: ${employees[i].position}`)
                        .text(task)
                        .images([
                            builder.CardImage.create(session, 'https://msdnshared.blob.core.windows.net/media/2017/03/Azure-Cognitive-Services-e1489079006258.png')
                        ])
                    ;
                cards.push(card);
            }
        }
        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards)
            .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Assign jobs", "Assign jobs"),
                    builder.CardAction.imBack(session, "Task management", "Task management"),
                    builder.CardAction.imBack(session, "Main menu", "Main menu"),
                ]
            ))
            ;
        session.send(reply);
    }
]).triggerAction({
    matches: /Work Reports/i
});

bot.dialog('Assign jobs', [
    function (session, results) {
        var userid = session.userData.identity;
        var options = {
            method: 'GET',
            url: 'http://localhost:8000/api/employees/'
        };
        request(options, function (error, response, body) {
            var employees = JSON.parse(body);
            session.dialogData.members = new Array();
            session.dialogData.membersid = new Array();
            for (i = 0; i < employees.length; i++) {
                if (employees[i].reportsto == userid) {
                    var membersid = employees[i].employeeid;
                    var member = employees[i].titleofcourtesy + " " + employees[i].firstname + " " + employees[i].lastname;
                    session.dialogData.membersid.push(membersid);
                    session.dialogData.members.push(member);
                }
            }
            var members = session.dialogData.members;
            builder.Prompts.choice(session, 'To who?', members, { listStyle: builder.ListStyle.button });
        })
    },
    function (session, results) {
        session.dialogData.member = results.response.entity
        session.dialogData.memberid = session.dialogData.membersid[results.response.index];
        builder.Prompts.text(session, `What do you want **${session.dialogData.member}** to do?`);
    },
    function (session, results) {
        var jobs = session.dialogData.jobs = results.response;
        var employee = session.dialogData.member;
        var reply = new builder.Message(session)
            .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Clock-in & Daily Plan", "Clock-in & Daily Plan"),
                    builder.CardAction.imBack(session, "Task management", "Task management"),
                    builder.CardAction.imBack(session, "Main menu", "Main menu"),
                ]
            ))
            ;
        session.send(reply);
        var employeeid = session.dialogData.memberid;
        var form = { 'employeeid': employeeid, 'job': jobs };
        var formData = querystring.stringify(form);
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData,
            url: 'http://localhost:8000/api/employeestask/'
        };
        request(options, function (error, response, body) {
            var options = {
                method: 'GET',
                url: 'http://localhost:8000/api/employeestask/'
            };
            request(options, function (error, response, body) {
                employeestask = JSON.parse(body);
            })
        });

    }
]).triggerAction({
    matches: /Assign jobs/i
});

bot.dialog('Cancel jobs', [
    function (session, results) {
        var userid = session.userData.identity;
        session.dialogData.members = new Array();
        session.dialogData.membersid = new Array();
        for (i = 0; i < employees.length; i++) {
            if (employees[i].reportsto == userid) {
                var membersid = employees[i].employeeid;
                var member = employees[i].titleofcourtesy + " " + employees[i].firstname + " " + employees[i].lastname;
                session.dialogData.membersid.push(membersid);
                session.dialogData.members.push(member);
            }
        }
        var members = session.dialogData.members;
        builder.Prompts.choice(session, 'To who?', members, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.member = results.response.entity
        var employeeid = session.dialogData.memberid = session.dialogData.membersid[results.response.index];
        var task = new Array();
        var taskid = new Array();
        for (j = 0; j < employeestask.length; j++) {
            if (employeestask[j].employeeid == employeeid) {
                if (employeestask[j].job) {
                    task.push(employeestask[j].job);
                    taskid.push(employeestask[j].id);
                }
            }
        }
        session.dialogData.task = task;
        session.dialogData.taskid = taskid
        builder.Prompts.choice(session, "Which one?", task, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        var index = results.response.index;
        var id = session.dialogData.taskid[index];
        var reply = new builder.Message(session)
            .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Assign jobs", "Assign jobs"),
                    builder.CardAction.imBack(session, "Cancel jobs", "Cancel jobs"),
                    builder.CardAction.imBack(session, "Task management", "Task management"),
                    builder.CardAction.imBack(session, "Main menu", "Main menu"),
                ]
            ))
            ;
        session.send(reply);
        var options = {
            method: 'DELETE',
            url: 'http://localhost:8000/api/employeestask/' + id + "/"
        };
        request(options, function (error, response, body) {
            var options = {
                method: 'GET',
                url: 'http://localhost:8000/api/employeestask/'
            };
            request(options, function (error, response, body) {
                employeestask = JSON.parse(body);
                session.send(`**Confirmed**`);
                session.replaceDialog("Task management");
            })
        });

    }
]).triggerAction({
    matches: /Cancel jobs/i
});

bot.dialog("Efficiency Report", function (session) {
    session.send("Sorry, we are still working on it.");
    session.replaceDialog("Task management");
});

bot.dialog("Log out", function (session) {
    session.userData.identity = 0;
    session.endDialog(`System offline. See you, **${session.userData.nameandtitle}**.`);
}).triggerAction({
    matches: /Log out/i
});
