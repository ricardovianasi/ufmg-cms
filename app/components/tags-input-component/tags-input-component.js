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
                resource: '=',
                label: '=nameLabel'
            },
        });

    TagsInputController.$inject = ['TagsService', 'PermissionService', '$rootScope'];
    function TagsInputController(TagsService, PermissionService, $rootScope) {

        let ctrlTags = this;

        let allTags = [];

        ctrlTags.getTags = getTags;
        ctrlTags.findTags = findTags;
        ctrlTags.onTagAdded = onTagAdded;

        ////////////////

        function getTags() {
            if(allTags.length) {
                return;
            }
            TagsService.getTags()
                .then(function (data) {
                    console.log('getTags', allTags);
                    allTags = data.data.items[0];
                });
        }

        function findTags($query) {
            return TagsService.findTags($query, allTags);
        }

        function onTagAdded(tag) {
            TagsService.addTagOnDataLoaded(tag);
        }

        function _setPermissionTag(userLoaded) {
            if(userLoaded && ctrlTags.resource) {
                ctrlTags.canPutTags = PermissionService.canPutTag(ctrlTags.resource);
            } else if(!ctrlTags.resource) {
                ctrlTags.canPutTags = true;
            }
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