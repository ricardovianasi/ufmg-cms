(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController() {
        var vm = this;

        vm.setImageCover = setImageCover;
        

        activate();

        ////////////////

        function activate() {
            vm.program = {title: ''};
        }

        function setImageCover(imageSelected) {
            vm.program.image = { url: imageSelected.url, id: imageSelected.id };
            console.log('setImageCover', vm.program);
        }

    }
})();