// start product

// _____________________________________________________________________________
bot.dialog("products",[
    function(session){
    session.dialogData.searchLogs={};
    builder.Prompts.choice(session,"功能",["庫存查詢","新增商品"],
    {listStyle:builder.ListStyle.button});    
    },
    function(session,results){
        console.log(results.response.entity)
        if(results.response.entity =="庫存查詢"){
            session.replaceDialog("productDetail");
        }else if(results.response.entity =="新增商品"){
            session.replaceDialog("productCreate");
        }
    }
]);
// __________________________________________________________________________
var eachP={};
bot.dialog("productDetail",[
    
    function(session){
        session.dialogData.products={}
        var productApi={
            method:"GET",
            url: menu.url + "api/v1/products"
        }
        //________________________________________________________________
        request(productApi,function(err,response,result){
            //把
            session.dialogData.products = JSON.parse(result)
            products=session.dialogData.products
            //把productEach丟進products變成各一個dict
            var b=[]
            var z=0
            //把每個dict的內容分割變成productEach的物件
            products.forEach(product => { 
                    // console.log(product.fields.amount)
                        x=product.fields   
                        b.push(product.fields.productname)                          
                    for(var i=z;i<b.length;i++){
                        var key = b[i];
                        var value = {"amount":product.fields.amount,
                                     "shelves":product.fields.shelves,
                                     "flavor":product.fields.flavor,
                                     "size":product.fields.size,
                                     "unitprice":product.fields.unitprice
                                    }
                        z+=1
                    } 
                    eachP[key]=value                
                });
            console.log(eachP)
            builder.Prompts.choice(session,"想查看何種產品?",eachP,{listStyle:builder.ListStyle.button});            
        })       
    },
    function(session,results){
        productName=results.response.entity
        session.dialogData.productCreate=eachP[results.response.entity]
        console.log(session.dialogData.productCreate)
        var msg =new builder.Message(session)
        msg.attachments([
            new builder.ReceiptCard(session)
            .title(`${productName}`)
            .facts([
                builder.Fact.create(session,`${session.dialogData.productCreate.amount}`,'庫存數量'),
                builder.Fact.create(session,`${session.dialogData.productCreate.shelves}`,'倉庫位置'),
                builder.Fact.create(session,`${session.dialogData.productCreate.flavor}`,'口味'),
                builder.Fact.create(session,`${session.dialogData.productCreate.size}`,'重量'),
                builder.Fact.create(session,`${session.dialogData.productCreate.unitprice}`,'售價')
            ])
        ])
        msg.suggestedActions(builder.SuggestedActions.create(
            session,[
                builder.CardAction.imBack(session,"修改","修改"),
                builder.CardAction.imBack(session,"主選單","主選單")
            ]
        ))
        session.endDialog(msg);
        session.replaceDialog("products",{reprompt:false})
        // console.log(session)
        // console.log(results
        // session.replaceDialog(items[results.response.entity]);
    },
    eachP={}
]);
//____________________________________________________________________________

bot.dialog("productCreate",[
    
    function createProductName(session){
        session.dialogData.productCreate={};
        builder.Prompts.text(session,"商品名稱");    
    },
    function createProductAmount(session,results){
        session.dialogData.productCreate.name = results.response;
        builder.Prompts.text(session,"庫存數量")
    },
    function createProductShelve(session,results){
        session.dialogData.productCreate.amount = results.response;
        builder.Prompts.text(session,"擺放架位")
    },
    function createProductFlavor(session,results){
        session.dialogData.productCreate.shelves = results.response;
        builder.Prompts.text(session,"口味")
    },
    function createProductSize(session,results){
        session.dialogData.productCreate.flavor = results.response;
        builder.Prompts.text(session,"重量")
    },
    function createProductUnitPrice(session,results){
        session.dialogData.productCreate.size = results.response;
        builder.Prompts.text(session,"售價")
    },
    function createProductList(session,results){
        session.dialogData.productCreate.unitprice = results.response;
        var aa=session.dialogData.productCreate
        var msg =new builder.Message(session)
        msg.attachments([
            new builder.ReceiptCard(session)
            .title(`${session.dialogData.productCreate.name}`)
            .facts([
                builder.Fact.create(session,`${session.dialogData.productCreate.amount}`,'庫存數量'),
                builder.Fact.create(session,`${session.dialogData.productCreate.shelves}`,'倉庫位置'),
                builder.Fact.create(session,`${session.dialogData.productCreate.flavor}`,'口味'),
                builder.Fact.create(session,`${session.dialogData.productCreate.size}`,'重量'),
                builder.Fact.create(session,`${session.dialogData.productCreate.unitprice}`,'售價')
            ])
        ])
        
        session.send(msg)
        builder.Prompts.choice(session,"商品是否確認新增?","是|否",
            {listStyle:builder.ListStyle.button});
    }, 
    // function createProductCheck(session,results){
    //     console.log(results)
    //     builder.Prompts.choice(session,"商品是否確認新增?","是 | 否",
    //         {listStyle:builder.ListStyle.button});
    //         createProductPost();
    //     },
    function createProductPost(session,results){
        console.log(session.dialogData.productCreate)
        if (results.response.entity=="是"){
            var check=session.dialogData.productCreate
            var productNewData=querystring.stringify(check)
            var options={
                method:'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                body:productNewData,
                url: menu.url + 'api/v1/products'
            }
            request(options,function(error,response,body){
                builder.Prompts.text(session,'商品已新增')
            })
            // session.send("商品已新增")
            session.replaceDialog("products",{reprompt:false})
        }else if(results.response.entity=="否"){
            session.replaceDialog("productCreate",{reprompt:false})
        }else{
            session.send("就是 跟 否 請唸清楚")
            console.log("過了")
            session.replaceDialog("productCreate",{reprompt:false})
            }
        },
    
])    
// __________________________________________________________________________
bot.dialog("productUpdate",[
    function createProductName(session){
        session.dialogData.productUpdate={};
        builder.Prompts.choice(session,"請問要修改哪個項目?","商品名稱|庫存數量|擺放架位|口味|重量|售價|全部",
                 {listStyle:builder.ListStyle.button});   
    },
    function updateProductName(session,results){
        theReq= results.response.entity;
        if (theReq=="商品名稱"){

        }
        else if(theReq=="庫存數量"){

        }
        else if(theReq=="庫存數量"){
            
        }
    }
])
// __________________________________________________________________________

// end product