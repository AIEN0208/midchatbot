

// import { each } from "async";

var restify = require("restify");
var builder = require("botbuilder");
var request = require("request");
var menu = require("./menuConfig.json");
var mainitem= menu.main;
var product= mainitem.product;


// mySql connecttion
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "yoghurt"
});


var server = restify.createServer();
server.listen(process.env.port ||
    process.env.PORT || "3978",    //給定的PORT號
    function () {
        console.log('%s listening to %s', server.name, server.url);
    });

var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppid,
    appPassword: process.env.MicrosoftAppPassword,
});

server.post('/api/messages', connector.listen());
// 問題區_____________________________________________________________________________
var bot = new builder.UniversalBot(connector,
    function (session) {
        session.send("我進入了")
        session.replaceDialog('mainMenu')
    });
// _____________________________________________________________________________
bot.dialog("prodcutAmount",[
    function(session){
        session.dialogData.products={}
        var productApi={
            method:"GET",
            url:"http://127.0.0.1:8000/api/v1/product"
        }
        //________________________________________________________________
        request(productApi,function(err,response,result){
            //把
            session.dialogData.products = JSON.parse(result)
            products=session.dialogData.products
            //用來存分類選項
            var items=[]
            //把productEach丟進products變成各一個dict
            var b=[]
            var json={};
            var eachP={};
            var z=0
            //把每個dict的內容分割變成productEach的物件
            products.forEach(product => { 
                    // console.log(product.fields.amount)
                        x=product.fields   
                        b.push(product.fields.productname)
                          
                    for(var i=z;i<b.length;i++){
                        var key = b[i];
                        var value = [{"Amount":product.fields.amount,
                                     "Shelves":product.fields.shelves,
                                     "Flavor":product.fields.flavor,
                                     "Size":product.fields.size,
                                     "Price":product.fields.price
                                    }]
                        
                        z+=1
                    } 
                    eachP[key]=value
                    
                });
                console.log(eachP)
            
            builder.Prompts.choice(session,"想查看何種產品?",b,{listStyle:builder.ListStyle.button});            
        })       
    },
    function(session,results){
        choice= session.response.entity;
        session.send("我進入了2")
        session.userData.productname= choice;
        session.userData.productlist= eachp;

        console.log(results)
        session.replaceDialog("productinfo")
        // session.replaceDialog(items[results.response.entity]);
    }
    
]);

bot.dialog('productinfo'[
    function(session){
        var name= session.userData.productname;
        var list= session.userData.productlist;
        list.name
            
    }
])
//______________________________________________________________________________
// bot.dialog("productDeatil",
//     function(session){
//         var msg= new builder.Message(session);
//         //設定輸出內容
//         msg.attachments([
//             new builder.ReceiptCard(session)
//             .title(msg.productname)
//             .facts([
//                 builder.Fact.create(session,msg.price,"金額: "),
//                 builder.Fact.create(session,msg.flavor,"口味: "),
//                 builder.Fact.create(session,msg.size,"重量: "),
//                 builder.Fact.create(session,msg.amount,"庫存量: "),
//                 builder.Fact.create(session,msg.shelves,"存放櫃位: "),
//             ])
//         ]); 
//         session.endDialog(msg);
//     })
// ____________________________________________________________________
// bot.dialog("productCreate",[
//     function(session){
//         session.dialogData.productCreate={};
//         builder.Prompts.text(session,"商品名稱");    
//     },
//     function(session,results){
//         session.dialogData.shipments.productName = results.response;
//         builder.Prompts.text(session,"總數量")
//     },
//     function(session,results){
//         session.dialogData.shipments.amount = results.response;
//         builder.Prompts.text(session,"擺放架位")
//     },
//     function(session,results){
//         session.dialogData.shipments.shelves = results.response;
//         builder.Prompts.text(session,"口味")
//     },
//     function(session,results){
//         session.dialogData.shipments.flavor = results.response;
//         builder.Prompts.text(session,"重量")
//     },
//     function(session,results){
//         session.dialogData.shipments.size = results.response;
//         builder.Prompts.text(session,"售價")
//     },
//     function(session,results){
//         session.dialogData.shipments.price = results.response;
//         session.endDialogWithResult({
//             response:session.dialogData.shipments
//         })
//     },
    
//     function(session){    
//         on.connect([
//             function(err) {
//             if (err) throw err;
//             console.log("Connected!");
//             var sql = "INSERT INTO product (productID,productName,amount,shelves) VALUES ('5', 'grape','100','E')";
//             con.query(sql, function (err, result) {
//               if (err) throw err;
//               console.log("1 record inserted");
//             });
//           }]);         
//     }
// ])
// ________________________________________________________________________________________
//____________________________________________________________________________
bot.dialog("product",[
    function(session){
    session.dialogData.searchLogs={};
    builder.Prompts.choice(session,"功能",["庫存查詢","商品新增"],
    {listStyle:builder.ListStyle.button});    
    },
    function(session,results){
        console.log(results.response.entity)
        if(results.response.entity =="庫存查詢"){
            session.replaceDialog("prodcutAmount");
        }else if(results.response.entity=="新增商品"){
            session.replaceDialog("productCreate")
        }
    }
]);

// _________________________________________________________________
bot.dialog('mainMenu',[
    function(session){
        var promptText="請選擇項目";       
        builder.Prompts.choice(session,promptText,mainitem,{listStyle:builder.ListStyle.button});
    },
    function(session,results){
        session.send("我進入了2")
        session.replaceDialog(mainitem[results.response.entity]);
    }
]);
// ________________________________________________________________________

