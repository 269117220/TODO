var express = require('express');
var router = express.Router();
var http = require('http');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/TODODB');
var url = require("url");
var crypto = require('crypto');

var getSha1 = function(str) {
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}

router
    .post('/users', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var collection = db.get('users');
        var user = db.get("users");
        collection.find({ "username": username }).then(function(data) {
           var _json={'code':0};
           console.log(data,data.length);
           if(data.length){
              _json.code=-1;
              res.send(_json);
           }else{
            user.insert({ "username": username, "password": password,"TODO":{} }, function(err, doc) {
                if (err) {
                    res.send(_json);
                } else {
                    _json.code=1;
                    res.send(_json);
                }
            });
           }
        });
    })
    .post('/login', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var collection = db.get('users');
        console.log(username,password);
        collection.find({"username": username, "password": password},function(e, docs) {
            console.log(docs,docs.length);
            var _json={'code':0};
            if(docs.length){
                _json.code=1;
                _json.userId=docs[0]._id;
                _json.username=username;
                _json.crypto=getSha1(docs[0]._id+username);
                console.log('>>',_json.crypto);
                _json.TODO=docs[0].TODO;
               res.send(_json);
            }else{
                collection.find({"username": username},function(e, docs) {
                    if(!docs.length){
                        _json.code=-1;
                       res.send(_json);
                    }else
                       res.send(_json);
                });
            }
        });
    })
    .post('/todos', function(req, res, next) {
        var todo = req.body.TODO;
        var id = req.body.id;
        var _json={'code':0};
        var collection = db.get('users');
        collection.find({},function(e, docs) {
            docs.forEach((todoItem,index)=>{
                if(todoItem._id==id){
                    collection.update(todoItem,{"$set" : {"TODO" :todo}}, function(err, doc) {
                            if (err) {
                                res.send(_json);
                            } else {
                                _json.code=1;
                                res.send(_json);
                            }
                    });
                    return;
                }
            });

        });

    })


module.exports = router;
