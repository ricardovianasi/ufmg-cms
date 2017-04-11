;
(function () {
    'use strict';

    angular.module('galleryModule')
        .controller('GalleryController', GalleryController);

    /** ngInject */
    function GalleryController($scope,
        dataTableConfigService,
        GalleryService,
        StatusService,
        NotificationService,
        ModalService,
        DateTimeHelper,
        $rootScope,
        PermissionService,
        Util,
        $log) {
        $log.info('GaleriasController');
        $rootScope.shownavbar = true;

        var vm = $scope;

        vm.galleries = [];
        vm.status = [];
        vm.currentPage = 1;
        vm.DateTimeHelper = DateTimeHelper;
        vm.removeGallery = _removeGallery;

        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

        onInit();

        function onInit() {
            _renderDataTable();
            // StatusService.getStatus().then(function (data) {
            //     vm.status = data.data;
            // });
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

            function getGalleries(params, fnCallback) {
                GalleryService
                    .getGalleries(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.galleries = res.data;
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
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getGalleries);
        }

        function _removeGallery(id, name) {
            ModalService
                .confirm('Você deseja excluir a galeria "' + name + '"?')
                .result
                .then(function () {
                    GalleryService.removeGallery(id).then(function () {
                        NotificationService.success('Galeria removida com sucesso.');
                        $route.reload();
                    });
                });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('gallery');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('gallery');
        }
    }
})();
