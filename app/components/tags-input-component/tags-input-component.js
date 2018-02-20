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
                addOnComma: '='
            },
        });

    TagsInputController.$inject = ['TagsService'];
    function TagsInputController(TagsService) {

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

        ctrlTags.$onInit = function() { };
        ctrlTags.$onChanges = function(changesObj) { };
        ctrlTags.$onDestroy = function() { };
    }
})();