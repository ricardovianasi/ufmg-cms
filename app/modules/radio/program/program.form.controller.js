(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController(RadioService, $routeParams, toastr) {
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
            vm.program.image = { url: imageSelected.url };
            vm.program.id_image = imageSelected.id;
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
            delete vm.program.image;
            RadioService.registerProgram(vm.program)
                .then(function() {
                    toastr.success('Programa de rádio cadastrado com sucesso!');
                    vm.program = {title: ''};
                });
        }

        function _update() {
            RadioService.updateProgram(vm.program, vm.id);
        }

        function _getProgram(id) {
            vm.loading = true;
            RadioService.program(id)
                .then(function(data) {
                    initObjProgram(data.title, data.description, data.image);
                })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function initObjProgram(title, description, image) {
            vm.program = {
                title: title,
                description: description,
            };
            setImageCover(image);
        }

    }
})();