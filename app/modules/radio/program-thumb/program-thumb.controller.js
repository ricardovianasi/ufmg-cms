(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramThumbController', ProgramThumbController);
    
    /** ngInject */
    function ProgramThumbController(RadioService, $routeParams) {
        var vm = this;
        vm.program = {};

        activate();

        ////////////////

        function _loadProgram() {
            RadioService.program(vm.id)
                .then(function(program) {
                    vm.program = program;
                });
        }

        function activate() {
            console.log($routeParams.id);
            vm.id = $routeParams.id;
            _loadProgram();
        }
    }
})();