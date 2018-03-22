(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('tagsInputComponent', {
            templateUrl:'components/tags-input-component/tags-input-component.html',
            controller: TagsInputController,
            controllerAs: 'ctrlTags',
            bindings: {
                ngModelTags: '=',
                addOnComma: '=',
                maxTags: '=',
                enforceMax: '=',
                resource: '@',
                label: '=nameLabel',
                hideLabel: '=',
                permissions: '='
            },
        });

    TagsInputController.$inject = ['TagsService', 'PermissionService', '$rootScope'];
    function TagsInputController(TagsService, PermissionService, $rootScope) {

        let ctrlTags = this;

        let allTags = [];

        ctrlTags.getTags = getTags;
        ctrlTags.findTags = findTags;

        ////////////////

        function getTags() {
            if(allTags.length) {
                return;
            }
            TagsService.getTags()
                .then(function (data) {
                    allTags = data.data.items;
                });
        }

        function findTags($query) {
            return TagsService.findTags($query, allTags);
        }

        function _setPermissionTag(userLoaded) {
            if(userLoaded && ctrlTags.resource) {
                ctrlTags.canPutTags = PermissionService.canPutTag(ctrlTags.resource);
                _setPermissionsTagSpecial();
            } else if(!ctrlTags.resource) {
                ctrlTags.canPutTags = true;
            }
        }

        function _setPermissionsTagSpecial() {
            if(!ctrlTags.permissions) {
                return;
            }
            const setPermissions = ctrlTags.permissions;
            ctrlTags.canPutTags = setPermissions.isAdmin ||
                (setPermissions.permissions ? setPermissions.permissions.putTag : ctrlTags.canPutTags);
        }

        function _permissions() {
            $rootScope.$watch('User', function (user) {
                let userLoaded = user && user.id;
                _setPermissionTag(userLoaded);
            });
        }

        ctrlTags.$onInit = function() {
            _permissions();
        };
        ctrlTags.$onDestroy = function() { };
    }
})();
