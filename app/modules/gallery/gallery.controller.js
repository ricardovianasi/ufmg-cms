(function () {
    'use strict';

    angular.module('galleryModule')
        .controller('GalleryController', GalleryController);

    /** ngInject */
    function GalleryController(dataTableConfigService, GalleryService, StatusService, NotificationService,
        ModalService, DateTimeHelper, PermissionService) {

        let vm = this;

        vm.removeGallery = removeGallery;
        vm.changeStatus = changeStatus;

        onInit();

        function removeGallery(id, name) {
            ModalService
                .confirm('Você deseja excluir a galeria "' + name + '"?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(function () {
                    GalleryService.removeGallery(id).then(function () {
                        NotificationService.success('Galeria removida com sucesso.');
                        vm.dtInstance.DataTable.draw();
                    });
                });
        }

        function changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            let numberOfColumns = 4;
            let columnsHasNotOrder = [3];

            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'createdAt'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_getGalleries);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
        }

        function _getGalleries(params, fnCallback) {
            GalleryService
                .getGalleries(dataTableConfigService.getParams(params))
                .then(function (res) {
                    _permissions();
                    vm.galleries = res.data;
                    let records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    fnCallback(records);
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

        function _initVariables() {
            vm.galleries = [];
            vm.status = [];
            vm.currentPage = 1;
            vm.itemStatus = 'all';
            vm.dtInstance = {};
            vm.canPost = false;
        }

        function onInit() {
            vm.convertDate = DateTimeHelper.convertDate;
            _initVariables();
            _renderDataTable();
        }
    }
})();
