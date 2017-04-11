;
(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalEditionsController', PeriodicalEditionsController);

    /** ngInject */
    function PeriodicalEditionsController($scope,
        $routeParams,
        $uibModal,
        PeriodicalService,
        NotificationService,
        DateTimeHelper,
        dataTableConfigService,
        $route,
        $rootScope,
        Util,
        $log,
        PermissionService) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalEditionsController');

        var vm = $scope;
        var removeConfirmationModal;

        vm.periodical = {};
        vm.periodical.id = $routeParams.id;
        vm.removeEdition = _removeEdition;
        vm.convertDate = _convertDate;
        vm.confirmationModal = _confirmationModal;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

        function onInit() {
            vm.periodical.name = PeriodicalService.getPeriodicalName();
            _renderDataTable();
        }

        function _changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            var numberOfColumns = 4;
            var columnsHasNotOrder = [3];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'number'
            },{
                index: 0,
                name: 'theme'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'publishDate'
            }]);

            function getPeriodicalEditions(params, fnCallback) {
                PeriodicalService
                    .getPeriodicalEditions(vm.periodical.id, dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.editions = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                         
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getPeriodicalEditions);
        }

        function _convertDate(data) {
            return DateTimeHelper.dateToStr(data);
        }

        function _removeEdition(id, description) {
            vm.confirmationModal('md', 'Você deseja excluir a edição "' + description + '"?');
            removeConfirmationModal.result.then(function (data) {
                PeriodicalService.removeEdition($routeParams.id, id).then(function (data) {
                    NotificationService.success('Edição removida com sucesso.');
                    $route.reload();
                });
            });
        }


        function _confirmationModal(size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: _confirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        }

        function _confirmationModalCtrl($scope, $uibModalInstance, title) {
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        function _permissions() {
            _canDelete();
            _canPost();
            _canPut();
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('editions', $routeParams.id);
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('editions', $routeParams.id);
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('editions', $routeParams.id);
        }

        onInit();
    }
})();
