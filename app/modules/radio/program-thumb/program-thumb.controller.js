(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramThumbController', ProgramThumbController);
    
    /** ngInject */
    function ProgramThumbController(RadioService, $routeParams, toastr, PermissionService) {
        var vm = this;

        vm.program = {};

        vm.setImageThumb = setImageThumb;
        vm.saveThumbnail = saveThumbnail;

        activate();

        ////////////////

        function setImageThumb(dataImage) {
            vm.program.image = dataImage;
        }

        function saveThumbnail() {
            let idImage = vm.program.image ? vm.program.image.id : null;
            RadioService.saveThumbnail(vm.program.id, idImage)
                .then(function() {
                    toastr.success('Thumbnail atualizado com sucesso!');
                });
        }

        function _loadProgram() {
            RadioService.program(vm.id)
                .then(function(program) {
                    _permissions();
                    vm.program = program;
                });
        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_thumb');
        }

        function activate() {
            console.log($routeParams.id);
            vm.id = $routeParams.id;
            _loadProgram();
        }
    }
})();