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
    "id": 8,
    "name": "Usuário de Testes 2",
    "status": true,
    "is_administrator": false,
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
            "posts": "1,2"
        }]
    }, {
        "post_type": "resource",
        "resource": "news",
        "privileges": [{
            "post_type": "privilege",
            "privilege": "POST",
            "posts": null
        }, {
            "post_type": "privilege",
            "privilege": "PUT",
            "posts": null
        }]
    }],
    "resources_perms": {
        "page": "POST;PUT:1,2",
        "news": "POST;PUT"
    }
};

function _convertPrivilegesToLoad() {
    var convertedPerms = {};
    var permsToConvert = user.resources_perms;
    Object.keys(permsToConvert).forEach(function (key) {
        permsToConvert[key].split(";").forEach(function (value) {
            var item = value.split(":");
            var permsToConvert = convertedPerms[key] || {};

            if (item.length > 1) {
                permsToConvert[item[0]] = isNaN(Number(item[1])) ? item[1] : Number(item[1]);
                permsToConvert[item[0]] = item[1];
                convertedPerms[key] = permsToConvert;
            } else {
                permsToConvert[item[0]] = [item[0]];
                convertedPerms[key] = permsToConvert;
            }
        });
    });
    user.resources_perms = convertedPerms;
}
// console.log(JSON.stringify(user.permissions));
// _convertPrivilegesToLoad();
// console.log('');
// console.log(JSON.stringify(user.permissions));


var listContextId = [1, 2, '3'];
var a = listContextId.toString();
console.log(a);

