var express= require('express')
var bodyParser=require('body-parser')
var jsonParser=bodyParser.json()
var MongoControl=require('./db C').MongoControl
var contact= new MongoControl('ClassTest','contact')
var app=express()
var urlencodedParser=bodyParser.urlencoded({extended:false})


app.use(express.static('./static'))
//静态目录

var handle500 =function(res){
    res.status(500).send('数据库错误')
}

//get请求

//1.获取全部联系人
app.get('/getAllContact',function(req,res){
    contact.find({},function(err,result){
        if(err){
            handle500(res)
            return
        }
        res.send(result)
    })
})

//2.查询联系人

app.get('/search',function(req,res){
    var wd =req.query.wd  //get请求参数解析为query
    var reg =new RegExp(wd,'i')
    contact.find({
        $or:[
            {name:{$regex:reg}},
            {phone:{$regex:reg}}
        ]
    },function(err,result){
        if(err){
            return handle500(res)
        }
        res.send(result)
    })

})

//3.删除联系人
app.get('/removeContact',function(req,res){
    var _id=req.query._id
    contact.removeById(_id,function(err,result){
        if(err){
            handle500(res)
            return 
        }
        res.send(result)
    })
})

//通过id查询
app.get('/findId',function(req,res){
    var _id=req.query._id
    contact.findById(_id,function(err,result){
        if(err){
            handle500(res)
            return
        }
        res.send(result)
    })
})

//post请求

//1.添加联系人
app.post('/addContact',urlencodedParser,function(req,res){
    var {name ,phone}=req.body
    var docs={
        name:name,
        phone:phone
    }
    contact.insert(docs,function(err,result){
        if(err){
             handle500(res)
             return
        }
        res.send({result:'成功'})
    })
})

//2.修改联系人

app.post('/reviseContact',urlencodedParser,function(req,res){
    console.log(req.body)
    var {_id,name,phone}=req.body
    contact.insert({
        name :name,
        phone:phone
    },function(err,result){
        if(err){
            handle500(res)
            console.log('修改出错')
            return 
        }
        contact.removeById(_id,function(err,result){
            if(err){
                handle500(res)
                console.log('删除出错')
                return
            }
            res.send(result)
        })
    })

})

app.listen(3000)