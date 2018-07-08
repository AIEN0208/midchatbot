var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var querystring = require('querystring');
var taskmenu = require('./menuConfig.json');
var task = taskmenu.task;

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
        var identity = session.userData.identity;
        if (identity == 0) {
            session.replaceDialog("Login")
        } else if (identity == 2) {
            builder.Prompts.choice(session, "請選擇以下功能.", "成員工作清單|工作情況回報|回主選單", { listStyle: builder.ListStyle.button });
        } else if (identity == 5) {
            builder.Prompts.choice(session, "請選擇以下功能.", "成員/工作清單|呈報工作情況|工作情況回報|回主選單", { listStyle: builder.ListStyle.button });
        } else {
            builder.Prompts.choice(session, "請選擇以下功能.", "工作清單|呈報工作情況|回主選單", { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        session.replaceDialog(task[results.response.entity]);
    }
]).triggerAction({
    matches: /Task management/i
});

bot.dialog("Clock-in & Daily Plan", [
    function (session) {
        var id = session.userData.identity;
        var cards = [];
        for (i = 0; i < employees.length; i++) {
            var task = "";
            var employeeid = employees[i].employeeid;
            if (employees[i].reportsto == id || employees[i].employeeid == id) {
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
                // if(task){
                cards.push(card);
                // }
            }
        }
        // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards)
            .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Assign jobs", "指派任務"),
                    builder.CardAction.imBack(session, "Cancel jobs", "取消任務"),
                    builder.CardAction.imBack(session, "Task management", "回任務管理"),
                    builder.CardAction.imBack(session, "Main menu", "主選單"),
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
                    builder.CardAction.imBack(session, "Assign jobs", "指派工作"),
                    builder.CardAction.imBack(session, "Task management", "回任務管理"),
                    builder.CardAction.imBack(session, "Main menu", "主選單"),
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
            session.dialogData.members.push("Cancel");
            var members = session.dialogData.members;
            builder.Prompts.choice(session, '向誰指派?', members, { listStyle: builder.ListStyle.button });
        })
    },
    function (session, results) {
        session.dialogData.member = results.response.entity
        if (session.dialogData.member != "Cancel") {
            session.dialogData.memberid = session.dialogData.membersid[results.response.index];
            builder.Prompts.text(session, `你希望 **${session.dialogData.member}** 做什麼?`);
        } else {
            session.replaceDialog("Task management")
        }
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
                    builder.CardAction.imBack(session, "Assign jobs", "指派任務"),
                    builder.CardAction.imBack(session, "Cancel jobs", "取消任務"),
                    builder.CardAction.imBack(session, "Task management", "回任務管理"),
                    builder.CardAction.imBack(session, "Main menu", "主選單"),
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

bot.dialog('Work Submits', [
    function (session) {
        var id = session.userData.identity;
        var cards = [];
        for (i = 0; i < employees.length; i++) {
            if (employees[i].employeeid == id) {
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
                    builder.CardAction.imBack(session, "Submit reports", "新增呈報"),
                    builder.CardAction.imBack(session, "Update reports", "修改呈報"),
                    builder.CardAction.imBack(session, "Delete reports", "刪除呈報"),
                    builder.CardAction.imBack(session, "Task management", "回任務管理"),
                    builder.CardAction.imBack(session, "Main menu", "主選單"),
                ]
            ))
            ;
        session.send(reply);
    }
]).triggerAction({
    matches: /Work Submits/i
});

bot.dialog('Submit reports', [
    function (session) {
        builder.Prompts.text(session, `請輸入新增事項: `);
    },
    function (session, results) {
        var reports = session.dialogData.reports = results.response;
        if (reports != "cancel") {
            session.send(`確認呈報以下事項: <br/>${reports}`);
            var reply = new builder.Message(session)
                .suggestedActions(builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "Clock-in & Daily Plan", "工作清單"),
                        builder.CardAction.imBack(session, "Task management", "任務管理"),
                        builder.CardAction.imBack(session, "Main menu", "主選單"),
                    ]
                ))
                ;
            session.send(reply);
            var employeeid = session.userData.identity;
            var form = { 'employeeid': employeeid, 'dailyreport': reports };
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
        } else {
            session.replaceDialog("Task management");
        }
    }
]).triggerAction({
    matches: /Submit reports/i
});

bot.dialog('Delete reports', [
    function (session, results) {
        var employeeid = session.userData.identity;
        var task = new Array();
        var taskid = new Array();
        for (j = 0; j < employeestask.length; j++) {
            if (employeestask[j].employeeid == employeeid) {
                if (employeestask[j].dailyreport) {
                    task.push(employeestask[j].dailyreport);
                    taskid.push(employeestask[j].id);
                }
            }
        }
        session.dialogData.task = task;
        session.dialogData.taskid = taskid
        task.push("Cancel")
        builder.Prompts.choice(session, "Which one?", task, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity != "Cancel") {
            var index = results.response.index;
            var id = session.dialogData.taskid[index];
            var reply = new builder.Message(session)
                .suggestedActions(builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "Assign jobs", "指派任務"),
                        builder.CardAction.imBack(session, "Cancel jobs", "取消任務"),
                        builder.CardAction.imBack(session, "Task management", "回任務管理"),
                        builder.CardAction.imBack(session, "Main menu", "主選單"),
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
        } else {
            session.replaceDialog("Task management");
        }
    }
]).triggerAction({
    matches: /Delete reports/i
});

bot.dialog("Efficiency Report", function (session) {
    session.send("Sorry, we are still working on it.");
    session.replaceDialog("Task management");
});
