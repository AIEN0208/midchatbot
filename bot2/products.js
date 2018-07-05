// start product

// _____________________________________________________________________________
bot.dialog("products",[
    function(session){
    session.dialogData.searchLogs={};
    builder.Prompts.choice(session,"功能",["庫存查詢","新增商品"],
    {listStyle:builder.ListStyle.button});    
    },
    function(session,results){
        // console.log(results.response.entity)
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
            url:menu.url+'api/v1/products'
        }
        //________________________________________________________________
        request(productApi,function(err,response,result){
            //把
            session.dialogData.products = JSON.parse(result)
            products=session.dialogData.products
            
            var b=[]
            var z=0
            //把每個dict的內容分割變成productEach的物件
            products.forEach(product => { 
                     // console.log(product.fields.amount)
                        x=product.fields   
                        b.push(product.fields.productname)                          
                    for(var i=z;i<b.length;i++){
                        var key = b[i];
                        var value = {
                                    "id":product.pk,
                                    "amount":product.fields.amount,
                                    "shelves":product.fields.shelves,
                                    "flavor":product.fields.flavor,
                                    "size":product.fields.size,
                                    "unitprice":product.fields.unitprice
                                    }
                        z+=1
                    } 
                    eachP[key]=value                
                });
            // console.log(eachP)
            builder.Prompts.choice(session,"想查看何種產品?",eachP,{listStyle:builder.ListStyle.button});            
        })       
    },
    function(session,results){
        productName=results.response.entity
        session.dialogData.productDetail=eachP[results.response.entity]
        updateE=session.dialogData.productDetail
        console.log(updateE.id)
        updateE.name=productName
        // console.log(session.dialogData.productCreate)
        var msg =new builder.Message(session)
        msg.attachments([
            new builder.ReceiptCard(session)
            .title(`${productName}`)
            .facts([
                builder.Fact.create(session,`${session.dialogData.productDetail.amount}`,'庫存數量'),
                builder.Fact.create(session,`${session.dialogData.productDetail.shelves}`,'倉庫位置'),
                builder.Fact.create(session,`${session.dialogData.productDetail.flavor}`,'口味'),
                builder.Fact.create(session,`${session.dialogData.productDetail.size}`,'重量'),
                builder.Fact.create(session,`${session.dialogData.productDetail.unitprice}`,'售價')
            ])
            
        ])
        msg.suggestedActions(builder.SuggestedActions.create(
            session,[
                builder.CardAction.imBack(session,"修改商品","修改商品"),
                builder.CardAction.imBack(session,"Main menu","主選單")
            ]
        ))
        // console.log(msg)
        session.endDialog(msg);
    
        // console.log(session)
        // console.log(results
        // session.replaceDialog(items[results.response.entity]);
    },
    eachP={}
])
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
                url:menu.url+'api/v1/products'
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
            // console.log("過了")
            session.replaceDialog("productCreate",{reprompt:false})
            }
        },
    
]).triggerAction({matches:/^新增商品$/})
// __________________________________________________________________________
bot.dialog("productUpdate",[
    
    function createProductName(session){
        session.dialogData.productUpdate={};
        builder.Prompts.choice(session,"請問要修改哪個項目?","商品名稱|庫存數量|擺放架位|口味|重量|售價|全部",
                 {listStyle:builder.ListStyle.button});   
    },
    function updateProductName(session,results){
        console.log(updateE)
        theReq= results.response.entity;
        if (theReq=="商品名稱"){
            
        }
        else if(theReq=="庫存數量"){

        }
        else if(theReq=="擺放架位"){
            
        }
        else if(theReq=="口味"){
            
        }
        else if(theReq=="重量"){
            
        }
        else if(theReq=="售價"){
            
        }
        else{
            session.replaceDialog("productUpdateAll",{reprompt:false})
        }
    }
]).triggerAction({matches:/^修改商品$/})

var updateE={};
bot.dialog("productUpdateAll",[
    function updateProductName(session){
        session.send("Get in")
        builder.Prompts.text(session,`目前商品名稱為${updateE.name}，請輸入欲更新的名稱，不需更改請輸入'N'`);    
    },
    function updateProductAmount(session,results){
            if (results.response != "N") {
                updateE.name=results.response
            }
            builder.Prompts.text(session, `目前商品庫存為${updateE.amount}，請輸入欲更新的庫存，不需更改請輸入'N'`)
    },
    function updateProductShelve(session,results){
        if (results.response != "N") {
            updateE.amount= results.response
        }
        builder.Prompts.text(session,`目前商品位置為${updateE.shelves}，請輸入欲更新的位置，不需更改請輸入'N'`)
    },
    function updateProductFlavor(session,results){
        if (results.response != "N") {
            updateE.shelves= results.response
        }
        builder.Prompts.text(session,`目前商品口味為${updateE.flavor}，請輸入欲更新的口味，不需更改請輸入'N'`)
    },
    function updateProductSize(session,results){
        if (results.response != "N") {
            updateE.flavor= results.response
        }
        builder.Prompts.text(session,`目前商品重量為${updateE.size}，請輸入欲更新的重量，不需更改請輸入'N'`)
    },
    function updateProductUnitPrice(session,results){
        if (results.response != "N") {
            updateE.size= results.response
        }
        builder.Prompts.text(session,`目前商品售價為${updateE.unitprice}，請輸入欲更新的售價，不需更改請輸入'N'`)
    },
    function updateProductList(session,results){
        if (results.response != "N") {
            updateE.unitprice = results.response;
        }
        var msg =new builder.Message(session)
        msg.attachments([
            new builder.ReceiptCard(session)
            .title(`${updateE.name}`)
            .facts([
                builder.Fact.create(session,`${updateE.id}`,'商品編號'),
                builder.Fact.create(session,`${updateE.amount}`,'庫存數量'),
                builder.Fact.create(session,`${updateE.shelves}`,'倉庫位置'),
                builder.Fact.create(session,`${updateE.flavor}`,'口味'),
                builder.Fact.create(session,`${updateE.size}`,'重量'),
                builder.Fact.create(session,`${updateE.unitprice}`,'售價')
            ])
        ])
        
        session.send(msg)
        builder.Prompts.choice(session,"商品是否確認修改?","是|否",
            {listStyle:builder.ListStyle.button});
    }, 
    function createProductPost(session,results){
        
        if (results.response.entity=="是"){
            var check=updateE
            var productUpdateData=querystring.stringify(check)
            var options={
                method:'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                body:productUpdateData,
                url:menu.url+'api/v1/products/update'
            }
            request(options,function(error,response,body){
                
                builder.Prompts.text(session,'商品已修改')
            })
            updateE={}
            // session.send("商品已新增")
            session.replaceDialog("products",{reprompt:false})
        }else if(results.response.entity=="否"){
            session.replaceDialog("productUpdateAll",{reprompt:false})
        }else{
            session.send("就是 跟 否 請唸清楚")
            // console.log("過了")
            session.replaceDialog("productCreate",{reprompt:false})
            }
        },
])
// __________________________________________________________________________

// end product