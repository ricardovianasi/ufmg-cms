(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('ProgramFormController', ProgramFormController);
    
    /** ngInject */
    function ProgramFormController() {
        var vm = this;
        

        activate();

        ////////////////

        function activate() {
            vm.program = {title: ''};
        }
    }
})();