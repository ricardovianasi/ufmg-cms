var l = any => console.log(any);

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

function hasContext(permission, context) {
    if (permission.resource === context) {
        return permission;
    }
}

function getPermissions(context) {
    for (var i = 0; i < user.permissions.length; i++) {
        var permission = user.permissions[i];
        if (hasContext(permission, context)) {
            return permission.privileges;
        }
    }
    return false;
}

function hasRole(privilege, role) {
    if (privilege.privilege === role) {
        return privilege;
    }
}

function getPrivilege(context, role) {
    const permissions = getPermissions(context);
    if (!permissions) {
        return false;
    }
    for (var i = 0; i < permissions.length; i++) {
        var privilege = permissions[i];
        if (hasRole(privilege, role)) {
            return privilege;
        }
    }
}

function hasId(id, posts) {
    var array = posts.split(',');
    var postId = id.toString();
    for (var i = 0; i < array.length; i++) {
        var id = array[i];
        if (postId === id) {
            return true;
        }
    }
    return false;
}

function verifyRole(hasPrivilege, id) {
    if (hasPrivilege === undefined || !hasPrivilege) { // Sem permissão
        return false;
    }
    if (id === undefined || id === null) { // Com permissão
        return true;
    }
    // Permissão específica
    var posts = hasPrivilege.posts;
    if (!posts) {
        return true;
    }
    return hasId(id, posts);
}

function check(context, id, role) {
    if (user.is_administrator) {
        return true;
    }
    const hasPrivilege = getPrivilege(context, role);
    return verifyRole(hasPrivilege, id);
}

function canPost(context, id) {
    return check(context, id, 'POST');
}

function canDelete(context, id) {
    return check(context, id, 'DELETE');
}

function canPut(context, id) {
    return check(context, id, 'PUT');
}

l('');
l('news');
l('PUT: ' + canPut('news'));
l('DELETE: ' + canDelete('news'));
l('POST: ' + canPost('news'));
l('');
l('page');
l('PUT: ' + canPut('page', 1));
l('DELETE: ' + canDelete('page'));
l('POST: ' + canPost('page'));
l('');
l('asd');
l('PUT: ' + canPut('asd'));
l('DELETE: ' + canDelete('asd'));
l('POST: ' + canPost('asd'));
