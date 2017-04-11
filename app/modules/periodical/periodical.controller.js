(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalController', PeriodicalController);

    /** ngInject */
    function PeriodicalController($scope,
        dataTableConfigService,
        PeriodicalService,
        DateTimeHelper,
        $uibModal,
        NotificationService,
        $route,
        DTOptionsBuilder,
        PermissionService,
        DTColumnDefBuilder,
        $rootScope,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalController');

        var vm = $scope;
        var removeConfirmationModal;
        vm.periodicals = [];
        vm.currentPage = 1;
        vm.confirmationModal = _confirmationModal;
        vm.convertDate = _convertDate;
        vm.removePeriodical = _removePeriodical;
        vm.setNamePeriodical = _setNamePeriodical;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

        onInit();

        function onInit() {
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
                name: 'name'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);

            function getPeriodicals(params, fnCallback) {
                PeriodicalService
                    .getPeriodicals(false, dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.periodicals = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                        Util.restoreOverflow();
                    });
            }

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getPeriodicals);
        }

        function _setNamePeriodical(periodical) {
            PeriodicalService.setPeriodicalName(periodical);
        }

        function _convertDate(data) {
            return DateTimeHelper.dateToStr(data);
        }

        function _removePeriodical(id, description) {
            vm.confirmationModal('md', 'Você deseja excluir a publicação "' + description + '"?');
            removeConfirmationModal.result.then(function (data) {
                PeriodicalService.removePeriodical(id).then(function (data) {
                    NotificationService.success('Publicação removida com sucesso.');
                    $route.reload();
                });
            });
        }

        function _confirmationModal(size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: _ConfirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        }

        function _ConfirmationModalCtrl($scope, $uibModalInstance, title) {
            var vm = $scope;
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
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('periodical');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('periodical');
        }
    }
})();
