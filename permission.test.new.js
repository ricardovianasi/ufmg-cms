var pages = {
    items: [{
        "post_type": "page",
        "id": 74,
        "title": "Auditórios",
        "status": "published"
    }, {
        "post_type": "page",
        "id": 74,
        "title": "Auditórios",
        "status": "published"
    }, {
        "post_type": "page",
        "id": 74,
        "title": "Auditórios",
        "status": "published"
    }],
};

var contextIdSelect = [];
var contextIdDeSelect = [];

var user = {
    "permissions": [{
        "post_type": "resource",
        "resource": "page",
        "privileges": [{
            "post_type": "privilege",
            "privilege": "POST",
            "posts": null
        }, {
            "post_type": "privilege",
            "privilege": "PUT",
            "posts": null
        }, {
            "post_type": "privilege",
            "privilege": "DELETE",
            "posts": null
        }]
    }],
    "resources_perms": {
        "page": {
            "POST": ["POST"],
            "PUT": '1,2,12',
            "DELETE": ["DELETE"]
        }
    }
};


function _convertPrivilegesToSave() {
    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }
    var clonedPerms = (cloneObject(user.resources_perms));
    Object.keys(clonedPerms).forEach(function (k) {
        var innerKeys = Object.keys(clonedPerms[k]),
            items = [];
        innerKeys.forEach(function (key) {
            if (clonedPerms[k][key][0]) {
                permission = (Array.isArray(clonedPerms[k][key])) ? key : key + ":" + clonedPerms[k][key];
                items.push(permission);
            }
        });
        clonedPerms[k] = items.join(";");
    });
    user.permissions = clonedPerms;
}
console.log('');
console.log(JSON.stringify(user.permissions));
_convertPrivilegesToSave();
console.log('');
console.log(JSON.stringify(user.permissions));
