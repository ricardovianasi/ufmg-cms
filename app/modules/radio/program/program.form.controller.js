(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService) {
        var vm = this;

        vm.setImageCover = setImageCover;
        vm.save = save;

        activate();

        ////////////////

        function activate() {
            vm.program = {title: ''};
        }

        function setImageCover(imageSelected) {
            vm.program.image = { url: imageSelected.url, id: imageSelected.id };
            console.log('setImageCover', vm.program);
        }

        function save() {
            RadioService.registerProgram(vm.program);
        }

    }
})();