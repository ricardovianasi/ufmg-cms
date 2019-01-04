(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertFormController', alertFormController);

    /** ngInject */
    function alertFormController(AlertService, AlertPermissionService, $routeParams) {
        var vm = this;

        vm.saveAlert = saveAlert;

        activate();

        ////////////////

        function saveAlert() {
            console.log('saveAlert', vm.alert);
            AlertService.save(vm.alert)
                .then(res => console.log(res));
        }

        function activate() {
            vm.title = 'Cadastrar Alerta';
            vm.idAlert = $routeParams.id;

            if(vm.idAlert) {
                loadAlert();
            } else {
                vm.alert = {post_date: new Date(), post_time: '12:00'};
            }
        }

        function loadAlert() {

            AlertService.alert(vm.idAlert)
                .then(alert => {
                    vm.alert = alert;
                    console.log(vm.alert);
                });
        }
    }
})();
