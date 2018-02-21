(function() {
    'use strict';

    angular
        .module('tagsModule')
        .controller('TagsController', TagsController);

        /** ngInject */
    function TagsController(TagsService) {
        var vm = this;
        

        activate();

        ////////////////

        function activate() { }
    }
})();