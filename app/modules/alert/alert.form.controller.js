(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertFormController', alertFormController);

    /** ngInject */
    function alertFormController(AlertService, AlertPermissionService, $routeParams, NotificationService, $location, ModalService) {
        var vm = this;

        vm.saveAlert = saveAlert;
        vm.removeAlert = removeAlert;

        activate();

        ////////////////

        function saveAlert() {
            AlertService.save(vm.alert)
                .then(res => {
                    $location.path('/alert/edit/' + res.data.id);
                    NotificationService.success('O alerta foi salvo com sucesso.');
                });
        }

        function removeAlert() {
            ModalService
                .confirm('Você deseja excluir este alerta?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(() => AlertService.remove(id))
                .then(() => {
                    NotificationService.success('O alerta excluído com sucesso.');
                    $location.path('/alert');
                });
        }

        function loadAlert() {
            AlertService.alert(vm.idAlert)
                .then(alert => {
                    vm.alert = alert;
                    console.log(vm.alert);
                });
        }

        function activate() {
            vm.idAlert = $routeParams.id;

            if(vm.idAlert) {
                vm.title = 'Editar alerta';
                loadAlert();
            } else {
                vm.title = 'Cadastrar alerta';
                vm.alert = {post_date: new Date(), post_time: '12:00', status: 'draft'};
            }
        }
    }
})();
