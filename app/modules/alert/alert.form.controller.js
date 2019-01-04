(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertFormController', alertFormController);

    /** ngInject */
    function alertFormController(AlertService, AlertPermissionService, $routeParams, NotificationService, $location) {
        var vm = this;

        vm.saveAlert = saveAlert;

        activate();

        ////////////////

        function saveAlert() {
            AlertService.save(vm.alert)
                .then(res => {
                    $location.path('/alert/edit/' + res.data.id);
                    NotificationService.success('O alerta foi salvo com sucesso.');
                });
        }

        function activate() {
            vm.idAlert = $routeParams.id;

            if(vm.idAlert) {
                vm.title = 'Editar alerta';
                loadAlert();
            } else {
                vm.title = 'Cadastrar alerta';
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
