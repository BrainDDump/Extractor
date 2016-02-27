
const kMaxDepth = 5;

var getFreeNode = function(callback) {
    var query = new Parse.Query("Node");
    query.doesNotExist("child");
    query.notEqualTo("depth", kMaxDepth);
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
                response.success(ancestors.concat(newArray));
            });
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.afterSave("Node", function(request, response) {
    var newNode      = request.object;
    var parentNodeId = newNode.get("parent").id

    var parentQuery = new Parse.Query("Node");
    parentQuery.get(parentNodeId, {
        success: function(parentNode) {
            parentNode.set("child",       newNode);
            parentNode.set("childLocked", false);
            parentNode.save();
        },
        error: function(error) {
            response.error(error);
        }
    })
});




