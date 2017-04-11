(function () {
    'use strict';

    angular.module('releasesModule')
        .controller('ReleasesController', ReleasesController);

    function ReleasesController($scope,
        $uibModal,
        $filter,
        dataTableConfigService,
        NotificationService,
        ReleasesService,
        DateTimeHelper,
        PermissionService,
        $log,
        Util,
        $rootScope) {

        $rootScope.shownavbar = true;
        $log.info('ReleasesController');
        var vm = $scope;

        vm.title = 'Releases';
        vm.releases = [];
        vm.DateTimeHelper = DateTimeHelper;
        vm.currentPage = 1;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

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
                name: 'title'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);

            function getReleases(params, fnCallback) {
                ReleasesService
                    .getReleases(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.releases = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                         
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getReleases);
        }

        vm.changePage = function () {
            loadReleases(vm.currentPage);
        };

        var removeConfirmationModal;

        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            var vm = $scope;
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        vm.confirmationModal = function (size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: ConfirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        };

        vm.removeRelease = function (id, title) {
            vm.confirmationModal('md', $filter('format')('Você deseja excluir o release "{0}"?', title));

            removeConfirmationModal.result.then(function () {
                ReleasesService.destroy(id).then(function () {
                    NotificationService.success('Release removido com sucesso.');
                    loadReleases();
                });
            });
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('release');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('release');
        }

        onInit();
    }
})();
