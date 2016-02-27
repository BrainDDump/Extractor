
const kMaxDepth    = 5;
const kMaxChildren = 2;

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
            callback.error("Error in the function getFreeNode");
        }
    });
}

var getAncestors = function(node, callback) {
    if (typeof(node.get("parent")) == "undefined") {
        callback(new Array());
        return;
    }

    var ancestorQuery = new Parse.Query("Node");
    ancestorQuery.get(node.get("parent").id, {
        success: function(parent) {
            getAncestors(parent, function(ancestors) {
                var newArray = new Array(parent);
                callback(ancestors.concat(newArray));
            });
        },
        error: function(error) {
            callback(new Array("Error"));
        }
    })
}

Parse.Cloud.define("pull", function(request, response) {
	getFreeNode({
        success: function(node) {
            if (node == null) {
                response.success(new Array());
                return;
            }

            getAncestors(node, function(ancestors) {
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
    console.error(parentNodeId);
    var parentQuery = new Parse.Query("Node");
    parentQuery.get(parentNodeId, {
        success: function(parentNode) {
            parentNode.increment("rating",            -1);
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
    var newNode      = request.object;
    var parentNodeId = newNode.get("parent").id

    if (typeof(parentNodeId) == "undefined") {
        response.success("Success afterSave. Root node created");
        return;
    }

    var parentQuery = new Parse.Query("Node");
    parentQuery.get(parentNodeId, {
        success: function(parentNode) {
            parentNode.add("children", newNode.id);
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
    })
});


