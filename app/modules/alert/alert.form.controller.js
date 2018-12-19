(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertFormController', alertFormController);

    /** ngInject */
    function alertFormController() {
        var vm = this;


        activate();

        ////////////////

        function activate() {
            vm.title = 'Cadastrar Alerta';
            vm.alert = {};
        }
    }
})();
