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

        function findTags($query = '') {
            const query = $query.toLocaleLowerCase();
            let listTags =  TagsService.findTags(query, allTags);
            console.log('findTags', query, listTags);
            return listTags;
        }

        function _setPermissionTag(userLoaded) {
            if(userLoaded && ctrlTags.resource) {
                ctrlTags.canGet = PermissionService.canGet(ctrlTags.resource);
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

        function _prepareTagsOnlyView() {
            if (!ctrlTags.ngModelTags) {
                return;
            }
            ctrlTags.tagsOnlyView =
                ctrlTags.ngModelTags.map(function(tag) { return tag.text || tag.name; }).join(', ');
        }

        ctrlTags.$onInit = function() {
            _prepareTagsOnlyView();
            _permissions();
        };

        ctrlTags.$onDestroy = function() { };
    }
})();
