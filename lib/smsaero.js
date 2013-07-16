var http = require("http"),
    crypto = require("crypto"),
    SmsAero;

function formatParams(params){
    var result = [];

    Object.keys(params).forEach(function(key) {
        result.push(key + "=" + params[key]);
    });

    return result.join("&");
}

function mergeObjects(){
    var object = {},
        i = 0,
        length = arguments.length,
        source;

    for(; i < length; i++){
        if((source = arguments[i])){
            Object.getOwnPropertyNames(source).forEach(function(k){
                object[k] = source[k];
            });
        }
    }

    return object;
}

SmsAero = function(options){
    this.options = mergeObjects(options, {
        answer  : "json",
        password: crypto.createHash("md5").update(options.password).digest("hex")
    });
};

SmsAero.prototype.execute = function(method, params, callback){
    var url = "http://gate.smsaero.ru/" + method + "/?" + formatParams(mergeObjects(params, this.options));

    http
        .get(url, function(response){
            response.on("data", function(chunk){
                var data;

                try {
                    data = JSON.parse(chunk);

                    if(data.result && 'reject' === data.result){
                        callback(
                            new Error(data.result + ": " + data.reason)
                        );
                    } else {
                        callback(null, data);
                    }
                } catch(e){
                    callback(e);
                }
            });
        })
        .on("error", function(err){
            callback(err);
        });
};

SmsAero.prototype.send = function(params, callback){
    this.execute("send", params, function(err, data){
        if(err){
            callback(err);
        } else if("no credits" === data.result){
            callback(new Error(data.result));
        } else {
            callback(null, parseInt(data.id, 10));
        }
    });
};

SmsAero.prototype.status = function(id, callback){
    this.execute("status", {
        id: id
    }, function(err, data){
        if(err){
            callback(err);
        } else {
            callback(null, data.result);
        }
    });
};

SmsAero.prototype.balance = function(callback){
    this.execute("balance", {}, function(err, data){
        if(err){
            callback(err);
        } else {
            callback(null, parseInt(data.balance, 10));
        }
    });
};

SmsAero.prototype.senders = function(callback){
    this.execute("senders", {}, function(err, data){
        if(err){
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

SmsAero.prototype.sign = function(signature, callback){
    this.execute("sign", {
        sign: signature
    }, function(err, data){
        if(err){
            callback(err);
        } else {
            callback(null, data.accepted);
        }
    });
};

module.exports = SmsAero;