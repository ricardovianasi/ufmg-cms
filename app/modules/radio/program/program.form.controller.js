(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService, $routeParams) {
        var vm = this;
        vm.id = '';
        vm.setImageCover = setImageCover;
        vm.save = save;

        activate();

        ////////////////

        function activate() {
            vm.program = {title: ''};
            vm.id = $routeParams.id;
            console.log('activate', vm.id);
            if(vm.id) {
                _getProgram(vm.id);
            }
        }

        function setImageCover(imageSelected) {
            vm.program.image = { url: imageSelected.url, id: imageSelected.id };
            console.log('setImageCover', vm.program);
        }

        function save() {
            if(vm.id) {
                _update();
            } else {
                _register();
            }
        }
        
        function _register() {
            RadioService.registerProgram(vm.program);
        }

        function _update() {
            RadioService.updateProgram(vm.program, vm.id);
        }

        function _getProgram(id) {
            vm.loading = true;
            RadioService.program(id)
                .then(function(data) {
                    initObjProgram(data.title, data.description);
                })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function initObjProgram(title, description, imageUrl) {
            vm.program = {
                title: title,
                description: description,
            };
        }

    }
})();