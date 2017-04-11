(function () {
    'use strict';

    angular.module('featuredModule')
        .controller('FeaturedController', featuredNewController);

    /** ngInject */
    function featuredNewController(featuredService,
        PermissionService,
        DateTimeHelper,
        dataTableConfigService,
        $filter,
        $uibModal,
        $scope,
        NotificationService,
        $location,
        $route,
        Util,
        $rootScope) {
        $rootScope.shownavbar = true;

        var vm = $scope;
        var removeConfirmationModal;

        vm.DateTimeHelper = DateTimeHelper;
        vm.remove = _remove;
        vm.highlights = [];
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

            function getFeatureds(params, fnCallback) {
                featuredService
                    .getFeatureds(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.highlights = res.data;
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
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getFeatureds);
        }

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

        function _confirmationModal(size, title) {
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
        }

        function _remove(id, description) {
            _confirmationModal('md', $filter('format')('Você deseja excluir o destaque "{0}"?', description));

            removeConfirmationModal.result.then(function () {
                featuredService.destroy(id).then(function () {
                    loadHighlights();
                    NotificationService.success('Destaque removido com sucesso.');
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('highlighted_press');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('highlighted_press');
        }
        onInit();
    }
})();
