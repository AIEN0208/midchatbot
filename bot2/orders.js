// Modules import ====================================================================
var restify = require('restify')
var builder = require('botbuilder')
var request = require('request')
var server = restify.createServer()
var menu = require('./menuConfig.json')
var orders = menu.orders
// ==================================================================================
// Dialog function of 產品 ==========================================================
// 載入 Orders api 的資料 
var getorders
var ordersapi = {
    method: "GET",
    url: "http://localhost:8000/api/orders/",
}
request(ordersapi, function (error, response, result) {
    getorders = JSON.parse(result)
})
// 載入 Ordersdetail api 的資料
var getordersdetail
var ordersdetailapi = {
    method: "GET",
    url: "http://localhost:8000/api/ordersdetail/",
}
request(ordersdetailapi, function (error, response, result) {
    getordersdetail = JSON.parse(result)
})
// 載入 Product api 的資料
var getproducts
var productsapi = {
    method: "GET",
    url: "http://localhost:8000/api/products/",
}
request(productsapi, function (error, response, result) {
    getproducts = JSON.parse(result)
})
// Start order==========================================================================
bot.dialog('orders', [
    function (session, args) {
        var promptText
        if (args && args.reprompt) {
            promptText = "請問您還想要查詢或者新增訂單?"
        } else {
            promptText = "您好，這裡是訂單這訊。請問您想要查詢或者新增訂單?"
        }
        builder.Prompts.choice(session, promptText, orders.main, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.beginDialog(orders.main[results.response.entity]);
    }
]).triggerAction({
    matches: /^回訂單首頁$/
})

bot.dialog('ordersquit', [
    function (session) {
        session.send("離開訂單資訊")
        session.replaceDialog('Main menu', { reprompt: true })
    }
])

bot.dialog('ordersselect', [
    function (session) {
        session.dialogData.orders = {}
        builder.Prompts.choice(session, "請問您要依據何者查詢訂單?", orders.select, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        filter = orders.select[results.response.entity]
        if (filter == "OrderID") {
            builder.Prompts.text(session, "請問您要查詢最近的幾筆訂單資料呢?")
        } else if (filter == "CustomerName") {
            builder.Prompts.text(session, "請問您要查詢哪一個客戶的訂單資料呢?")
        } else if (filter == "OrderDate") {
            builder.Prompts.text(session, "請問您要查詢哪一天成立的訂單呢?")
        } else if (filter == "ShippedDate") {
            builder.Prompts.text(session, "請問您要查詢哪一天配送的訂單呢?")
        } else if (filter == "Complete") {
            builder.Prompts.choice(session, "請問您要查詢完成或者未完成的訂單?", ["已完成", "未完成"], { listStyle: builder.ListStyle.button })
        }
    },
    function (session, results) {
        var targetorder = []
        if (filter == "OrderID") {
            num = results.response
            getorders.forEach(order => {
                if (order.orderid > getorders.length - num) {
                    targetorder.push(order)
                }
            })
        } else if (filter == "CustomerName") {
            customername = results.response
            getorders.forEach(order => {
                if (order.customername == customername) {
                    targetorder.push(order)
                }
            })
        } else if (filter == "OrderDate") {
            orderdate = results.response
            getorders.forEach(order => {
                if (order.orderdate == orderdate) {
                    targetorder.push(order)
                }
            })
        } else if (filter == "ShippedDate") {
            shippeddate = results.response
            getorders.forEach(order => {
                if (order.shippeddate == shippeddate) {
                    targetorder.push(order)
                }
            })
        } else if (filter == "Complete") {
            complete = results.response.entity
            getorders.forEach(order => {
                if (order.complete == complete) {
                    targetorder.push(order)
                }
            })
        }
        //準備Message和要放進去的東西
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        var attachments = new Array();
        targetorder.forEach(order => {
            OrderID = JSON.stringify(order.orderid)
            CustomerName = JSON.stringify(order.customername)
            OrderDate = JSON.stringify(order.orderdate)
            ShippedDate = JSON.stringify(order.shippeddate)
            TotalPrice = JSON.stringify(order.totalprice)
            Complete = JSON.stringify(order.complete)
            var items = [];
            getordersdetail.forEach(detail => {
                if (detail.orderid == OrderID) {
                    if (detail.status != "Canceled") {
                        ProductName = JSON.stringify(detail.productname)
                        UnitPrice = JSON.stringify(detail.unitprice)
                        Quantity = JSON.stringify(detail.quantity)
                        SubtotalPrice = JSON.stringify(detail.subtotalprice)
                        var item = builder.ReceiptItem.create(session,
                            `$${SubtotalPrice}`, `${ProductName} $${UnitPrice} x ${Quantity}`)
                        items.push(item);
                    }
                }
            })//訂單明細迴圈結束
            var updatevalue = {
                dialog: "ordersupdate",
                order: { "orderid": OrderID }
            }
            var attachment = new builder.ReceiptCard(session)
                .title(`訂單編號 : ${OrderID}  客戶名稱 : ${CustomerName}`)
                .facts([
                    builder.Fact.create(session, OrderDate, "成立日期"),
                    builder.Fact.create(session, ShippedDate, "配送日期"),
                    builder.Fact.create(session, Complete, "訂單狀態"),
                ])
                .items(items)
                .total(`$${TotalPrice}`)
                .buttons([
                    builder.CardAction.postBack(session, JSON.stringify(updatevalue), "編輯訂單")
                ]);
            attachments.push(attachment);

        });
        msg.attachments(attachments);
        msg.suggestedActions(builder.SuggestedActions.create(
            session, [builder.CardAction.imBack(session, "回訂單首頁", "回訂單首頁")]
        ))
        session.endDialog(msg)
    },
])

bot.dialog('ordersnew', [
    function (session) {
        session.dialogData.new = {}
        builder.Prompts.text(session, "請輸入客戶名稱?")
    },
    function (session, results) {
        session.dialogData.new.customername = results.response
        builder.Prompts.text(session, "請輸入訂單成立日期?")
    },
    function (session, results) {
        session.dialogData.new.orderdate = results.response
        builder.Prompts.text(session, "請輸入訂單配送日期?")
    },
    function (session, results) {
        session.dialogData.new.shippeddate = results.response
        session.beginDialog("newdetail")
    },
    function (session, results) {
        var neworder = session.dialogData.new
        var customername = neworder.customername
        var orderdate = neworder.orderdate
        var shippeddate = neworder.shippeddate
        var totalprice = 0
        for (i = 0; i < newdetail.length; i++) {
            id = parseInt(newdetail[i].product[0])
            unitprice = parseInt(getproducts[id - 1].unitprice)
            amount = newdetail[i].amount
            subtotal = unitprice * amount
            totalprice += subtotal
            var options = {
                method: "POST",
                url: "http://localhost:8000/api/ordersdetail/",
                headers: { 'content-type': 'application/json' },
                body: {
                    orderid: getorders.length + 1,
                    productid: id,
                    productname: getproducts[id - 1].productname,
                    unitprice: unitprice,
                    quantity: amount,
                    subtotalprice: subtotal,
                    status: "onGoing"
                },
                json: true
            }
            request(options, function (error, response, result) {
                if (!error && response.statusCode == 201) {
                    console.log("success")
                } else {
                    console.log("GG")
                }
            })
        }
        var options = {
            method: "POST",
            url: "http://localhost:8000/api/orders/",
            headers: { 'content-type': 'application/json' },
            body: {
                customername: customername,
                orderdate: orderdate,
                shippeddate: shippeddate,
                totalprice: totalprice,
                complete: "未完成"
            },
            json: true
        }
        request(options, function (error, response, result) {
            if (!error && response.statusCode == 201) {
                console.log("success")
            } else {
                console.log("GG")
            }
            session.replaceDialog('orders', { reprompt: true })
        })
    }
])

var newdetail = []
bot.dialog('newdetail', [
    function (session) {
        var buttons = []
        getproducts.forEach(product => {
            var button = `${product.productid} - ${product.productname} - $${product.unitprice}`
            buttons.push(button);
        })
        buttons.push("完成")
        builder.Prompts.choice(session, "請選擇產品 :", buttons, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.product = results.response.entity
        if (results.response.entity == "完成") {
            session.endDialog()
        } else {
            builder.Prompts.number(session, "請輸入該產品數量");
        }
    },
    function (session, results) {
        session.dialogData.amount = results.response
        newdetail.push({ "product": session.dialogData.product, "amount": session.dialogData.amount })
        session.beginDialog("newdetail")
    }
])
var orderid
var customername
var orderdate
var shippeddate
var totalprice
var complete

bot.dialog('ordersupdate', [
    function (session) {
        order = JSON.parse(session.message.text).order
        orderid = parseInt(order.orderid)
        getorders.forEach(order => {
            if (order.orderid == orderid) {
                customername = order.customername
                orderdate = order.orderdate
                shippeddate = order.shippeddate
                totalprice = order.totalprice
                complete = order.complete
            }
        })
        builder.Prompts.text(session, `目前的客戶名稱為${customername}，請輸入更新的客戶名稱，若不需更改請輸入"0"。`)
    },
    function (session, results) {
        if (results.response != 0) {
            customername = results.response
        }
        builder.Prompts.text(session, `目前的訂單成立日期為為${orderdate}，請輸入更新的訂單成立日期，若不需更改請輸入"0"。`)
    },
    function (session, results) {
        if (results.response != 0) {
            orderdate = results.response
        }
        builder.Prompts.text(session, `目前的訂單配送日期為為${shippeddate}，請輸入更新的訂單配送日期，若不需更改請輸入"0"。`)
    },
    function (session, results) {
        if (results.response != 0) {
            shippeddate = results.response
        }
        builder.Prompts.choice(session, `目前的訂單為"${complete}"，請選擇更新狀態。`, ["完成", "未完成"], { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        complete = results.response.entity
        builder.Prompts.choice(session, "請問是否需要更改訂單明細?", ["更改訂單明細", "不須更改"], { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        if (results.response.entity == "更改訂單明細") {
            getordersdetail.forEach(detail => {
                if (detail.orderid == orderid) {
                    detailid = detail.detailid
                    // 更改訂單明細者，cancel原本detail
                    var options = {
                        method: "PUT",
                        url: "http://localhost:8000/api/ordersdetail/" + detailid + "/",
                        headers: { 'content-type': 'application/json' },
                        body: {
                            orderid: detail.orderid,
                            productid: detail.productid,
                            productname: detail.productname,
                            unitprice: detail.unitprice,
                            quantity: detail.quantity,
                            subtotalprice: detail.subtotalprice,
                            status: "Canceled"
                        },
                        json: true
                    }
                    request(options, function (error, response, result) {
                        if (!error) {
                            console.log("success cancel detail" + response.statusCode)
                        } else {
                            console.log("GG")
                        }
                    })
                }
            }) // forEach結束
            session.beginDialog('updatedetail')
        } else {
            //未更改訂單明細者，更新order資料
            var options = {
                method: "PUT",
                url: "http://localhost:8000/api/orders/" + orderid + "/",
                headers: { 'content-type': 'application/json' },
                body: {
                    customername: customername,
                    orderdate: orderdate,
                    shippeddate: shippeddate,
                    totalprice: totalprice,
                    complete: complete,
                },
                json: true
            }
            request(options, function (error, response, result) {
                if (!error && response.statusCode == 200) {
                    console.log("success")
                } else {
                    console.log("GG")
                }
                session.replaceDialog('orders', { reprompt: true })
            })
            if (complete = "完成") {
                getordersdetail.forEach(detail => {
                    if (detail.orderid == orderid) {
                        detailid = detail.detailid
                        if (detail.status != 'Canceled') {
                            // 狀態為完成者，更改detail狀態
                            var options = {
                                method: "PUT",
                                url: "http://localhost:8000/api/ordersdetail/" + detailid + "/",
                                headers: { 'content-type': 'application/json' },
                                body: {
                                    orderid: detail.orderid,
                                    productid: detail.productid,
                                    productname: detail.productname,
                                    unitprice: detail.unitprice,
                                    quantity: detail.quantity,
                                    subtotalprice: detail.subtotalprice,
                                    status: "Complete"
                                },
                                json: true
                            }
                            request(options, function (error, response, result) {
                                if (!error) {
                                    console.log("success complete detail" + response.statusCode)
                                } else {
                                    console.log("GG")
                                }
                            })
                        }
                        getproducts.forEach(product => {
                            if (product.productid == detail.productid) {
                                productid = product.productid
                                newamount = product.amount - detail.quantity
                                var options = {
                                    method: "PUT",
                                    url: "http://localhost:8000/api/products/" + productid + "/",
                                    headers: { 'content-type': 'application/json' },
                                    body: {
                                        productname: product.productname,
                                        unitprice: product.unitprice,
                                        amount: newamount
                                    },
                                    json: true
                                }
                                request(options, function (error, response, result) {
                                    if (!error) {
                                        console.log("success amount update" + response.statusCode)
                                    } else {
                                        console.log("GG")
                                    }
                                })
                            }
                        }) //getproduct forEach 結束
                    }
                }) // forEach結束
            }
        }
    },
    function (session, results) {
        totalprice = 0
        for (i = 0; i < updatedetail.length; i++) {
            id = parseInt(updatedetail[i].product[0])
            unitprice = parseInt(getproducts[id - 1].unitprice)
            amount = updatedetail[i].amount
            subtotal = unitprice * amount
            totalprice += subtotal
            // 更改訂單明細者，新增訂單明細
            var options = {
                method: "POST",
                url: "http://localhost:8000/api/ordersdetail/",
                headers: { 'content-type': 'application/json' },
                body: {
                    orderid: orderid,
                    productid: id,
                    productname: getproducts[id - 1].productname,
                    unitprice: unitprice,
                    quantity: amount,
                    subtotalprice: subtotal,
                    status: "onGoing"
                },
                json: true
            }
            request(options, function (error, response, result) {
                if (!error && response.statusCode == 201) {
                    console.log("success new detail")
                } else {
                    console.log("GG")
                }
            })
        } //for迴圈結束
        //更改訂單明細者，更新order資料
        var options = {
            method: "PUT",
            url: "http://localhost:8000/api/orders/" + orderid + "/",
            headers: { 'content-type': 'application/json' },
            body: {
                customername: customername,
                orderdate: orderdate,
                shippeddate: shippeddate,
                totalprice: totalprice,
                complete: complete
            },
            json: true
        }
        request(options, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                console.log("success update order")
            } else {
                console.log(response.statusCode)
            }
            session.replaceDialog('orders', { reprompt: true })
        })
    }
]).triggerAction({
    matches: /^{"dialog":"ordersupdate".*/
})
var updatedetail = []
bot.dialog('updatedetail', [
    function (session) {
        var buttons = []
        getproducts.forEach(product => {
            var button = `${product.productid} - ${product.productname} - $${product.unitprice}`
            buttons.push(button);
        })
        buttons.push("完成")
        builder.Prompts.choice(session, "請選擇產品 :", buttons, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.product = results.response.entity
        if (results.response.entity == "完成") {
            session.endDialog()
        } else {
            builder.Prompts.number(session, "請輸入該產品數量");
        }
    },
    function (session, results) {
        session.dialogData.amount = results.response
        updatedetail.push({ "product": session.dialogData.product, "amount": session.dialogData.amount })
        session.beginDialog("updatedetail")
    }
])
    // End order==================================================================
    // End Dialog function of 產品 ================================================