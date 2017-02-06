'use strict';

let group = ['Registred', 'Author', 'Editor', 'Publisher', 'Manager', 'Admin'];

let resource = [{
    group: 'jornalista',
    permissions: [{
        context: 'page',
        items: [{
            roles: {
                c: true,
                r: true,
                u: true,
                d: true,
                p: false
            }
        }]
    }]
}];

let admin = {
    id: 11,
    isAdmin: true,
};

let user = {
    id: 9,
    isAdmin: false,
    name: 'Henrique',
    moderador: [10],
    group: 'jornalista',
    permissions: [{
        context: 'page',
        items: [{
            id: 12,
            roles: {
                c: false
            }
        }]
    }, {
        context: 'events',
        items: [{
            id: 14,
            roles: {
                c: false,
                r: true,
                u: true,
                d: true,
            }
        }]
    }]
};

let moderator = {
    id: 10,
    name: 'Moderador',
    group: 'moderador',
    permissions: [{
        context: 'page',
        items: [{
            id: 12,
            roles: {
                c: false,
                r: false,
                u: false,
                d: false,
                p: false,
            }
        }]
    }]
};

let contexts = [{
    id: 12,
    context: 'page',
    title: 'Hello',
    moderators: [10],
    status: 'moderator'
}];

let rolesCurrent = {};

const isAdmin = (isAdmin) => {
    if (isAdmin) {
        console.log('Admin');
        rolesCurrent = {
            c: true,
            r: true,
            u: true,
            d: true,
            p: true
        };
        return true;
    }
    return false;
};

const checkPermissionIdModerator = (listModerators, userIdModerator) => {
    let res = false;
    listModerators.forEach(idModerator => {
        if (idModerator === userIdModerator) {
            res = true;
        }
    });
    return res;
};

const isModerator = (userIdModerator, contextName) => {
    let res = false;
    contexts.forEach(context => {
        if (context.context === contextName && checkPermissionIdModerator(context.moderators, userIdModerator)) {
            console.log('Moderador');
            rolesCurrent.p = true;
            res = true;
        }
    });
    return res;
};

const verifyUser = (context, contextId, u) => {
    u.permissions.forEach(permission => {
        if (context === permission.context) {
            permission.items.forEach(item => {
                if (contextId === item.id) {
                    rolesCurrent = item.roles;
                }
            });
        }
    });
};

const checkPermission = (context, contextId, u) => {
    if (!context && !contextId && !u) {
        return false;
    }
    if (isAdmin(u.isAdmin)) {
        return true;
    }
    verifyUser(context, contextId, u);
    isModerator(u.id, context);
};

const canUpdate = () => {
    return rolesCurrent.u ? true : false;
};

const canDelete = () => {
    return rolesCurrent.d ? true : false;
};

const canCreate = () => {
    return rolesCurrent.c ? true : false;
}

const canRemove = () => {
    return rolesCurrent.r ? true : false;
}

const canPublish = () => {
    return rolesCurrent.p ? true : false;
}

const setPermissions = u => {
    resource.forEach(permissionSuper => {
        if (u.group === permissionSuper.group) {
            delete permissionSuper.group;
            u.permissions.forEach((permissionUser, index) => {
                if (permissionUser.context === permissionSuper.permissions[0].context) {
                    const copy = Object.assign(permissionSuper.permissions[0].items[0].roles, permissionUser.items[0].roles);
                    u.permissions[index].items[0].roles = copy;
                    // console.log();
                    // console.log(u.permissions[index].items[0].roles);
                    // console.log();
                }
                // u.permissions[index] = copy;
                // console.log(permissionSuper.permissions);
            });
        }
    });
};

checkPermission('page', 12, user);
console.log(canCreate());
console.log(canRemove());
console.log(canUpdate());
console.log(canDelete());
console.log(canPublish());

console.log('');

setPermissions(user);

checkPermission('page', 12, user);
console.log(canCreate());
console.log(canRemove());
console.log(canUpdate());
console.log(canDelete());
console.log(canPublish());

console.log('');
console.log('');
console.log('');

checkPermission('page', 12, moderator);
console.log(canCreate());
console.log(canRemove());
console.log(canUpdate());
console.log(canDelete());
console.log(canPublish());

console.log('');
console.log('');
console.log('');

checkPermission('page', 12, admin);
console.log(canCreate());
console.log(canRemove());
console.log(canUpdate());
console.log(canDelete());
console.log(canPublish());
