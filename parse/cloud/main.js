
// Extentions
Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

// Configurations
const kMaxDepth    = 2;
const kMaxChildren = 2;

const kTwillioCred = {
    PHONE_NUMBER: "8055002188",

    ACCOUNT_SID: "AC5fafcc7cd2a64bf9bd9cc1383b54ff79",
    AUTH_TOKEN:  "ba6c1e90f165a4d12d87cca1633d788c"
}

// setup modules
var twilio  = require('twilio')(kTwillioCred.ACCOUNT_SID, kTwillioCred.AUTH_TOKEN);

// Helper functions
var getFreeNode = function(callback) {
    var query = new Parse.Query("Node");
    query.lessThan("depth",            kMaxDepth);
    query.lessThan("reservedChildren", kMaxChildren);
    query.greaterThan("rating",        -2);
    query.find({
        success: function(results) {
            if (results.length == 0) {
                callback.success(null);
                return;
            }

            var randomNode = results[Math.floor(Math.random()* results.length)];
            callback.success(randomNode);
        },
        error: function(error) {
            callback.error("Error in the function helpers.getFreeNode");
        }
    });
}

var getUpperNodes = function(node, callback) {
    if (typeof(node.get("parent")) == "undefined") {
        callback(new Array());
        return;
    }

    var ancestorQuery = new Parse.Query("Node");
    ancestorQuery.get(node.get("parent").id, {
        success: function(parent) {
            getUpperNodes(parent, function(ancestors) {
                var newArray = new Array(parent);
                callback(ancestors.concat(newArray));
            });
        },
        error: function(error) {
            callback(new Array("Error"));
        }
    });
}

var getAllContributersIds = function(node, callback) {
    getUpperNodes(node, function(nodes) {
        var contributersIds = [];
        nodes.forEach(function(item) {
            contributersIds.push(item.get("owner").id);
        });

        callback(contributersIds.getUnique());
    });
}

var sendTextToUser = function(userId, text) {
    var userQuery = new Parse.Query("_User");
    userQuery.get(userId, {
        success: function(user) {
            if (user.has("phoneNumber")) {
                var phoneNumber = user.get("phoneNumber");

                console.log("phoneNumber");
                console.log(phoneNumber);

                twilio.sendSms({
                    to:   phoneNumber,
                    from: kTwillioCred.PHONE_NUMBER,
                    body: text
                },
                {
                    success: function(httpResponse) {
                        console.log("SMS sent!");
                    },
                    error: function(httpResponse) {
                        console.error("Uh oh, something went wrong");
                    }
                });
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
}

Parse.Cloud.define("pull", function(request, response) {
	getFreeNode({
        success: function(node) {
            if (node == null) {
                response.success(new Array());
                return;
            }

            getUpperNodes(node, function(ancestors) {
                var newArray = new Array(node);

                node.increment("reservedChildren", 1);
                node.save({
                    success: function() {
                        response.success(ancestors.concat(newArray));
                    },
                    error: function(error) {
                        response.error(error);
                    }
                })
            });
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define("reject", function(request, response) {

    var parentNodeId = request.params.objectId;
    var parentQuery = new Parse.Query("Node");
    parentQuery.get(parentNodeId, {
        success: function(parentNode) {
            parentNode.increment("rating",           -1);
            parentNode.increment("reservedChildren", -1);
            parentNode.save({
                success: function() {
                    response.success();
                },
                error: function(error) {
                    response.error(error);
                }
            });
        },
        error: function(error) {
            response.error(error);
        }
    });
});

Parse.Cloud.afterSave("Node", function(request, response) {
    var newNode = request.object;

    if (newNode.has("parent") == false) {
        return;
    }

    if (newNode.get("depth") >= kMaxDepth) {
        var userId = newNode.get("owner").id;

        getUpperNodes(newNode, function(nodes) {
            // Setup the text of the list & get total rating
            var text   = newNode.get("content");
            var rating = 0;
            nodes.forEach(function(item) {
                text = item.get("content") + " " + text;
                rating += item.get("rating");
            });

            // Get all contributors
            var contributersIds = [];
            nodes.forEach(function(item) {
                contributersIds.push(item.get("owner").id);
            });
            contributersIds = contributersIds.getUnique();

            // Send each contributer a text message
            contributersIds.forEach(function(item) {
                sendTextToUser(item, text);
            });

            // Create list
            var list = new Parse.Object("List");
            list.set("lastNode",        newNode);
            list.set("rating",          rating);
            list.set("contributersIds", contributersIds);
            list.save();
        });
    }
});

