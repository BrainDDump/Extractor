
const kMaxDepth = 5;

var getFreeNode = function(callback) {
    var query = new Parse.Query("Node");
    query.doesNotExist("child");
    query.notEqualTo("depth", kMaxDepth);
    query.notEqualTo("childLocked", true);
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

                node.set("childLocked", true);
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

    var parentNodeId = request.objectId;
    console.error("*** parentNodeId: ", parentNodeId);
    var parentQuery = new Parse.Query("Node");
    parentQuery.find(parentNodeId, {
        success: function(parentNode) {
            parentNode.increment("rating", -1);
            parentNode.set("childLocked", false);
            parentNode.save();

            response.success();
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
            parentNode.set("child",       newNode);
            parentNode.set("childLocked", false);
            parentNode.save();

            response.success("Success afterSave");
        },
        error: function(error) {
            response.error(error);
        }
    })
});




