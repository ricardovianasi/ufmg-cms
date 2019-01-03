(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertFormController', alertFormController);

    /** ngInject */
    function alertFormController() {
        var vm = this;

        vm.saveAlert = saveAlert;

        activate();

        ////////////////

        function saveAlert() {
            console.log('saveAlert');
        }

        function activate() {
            vm.title = 'Cadastrar Alerta';
            vm.alert = {post_date: new Date(), post_time: '12:00'};
        }
    }
})();
