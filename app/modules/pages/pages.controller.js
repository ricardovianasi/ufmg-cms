(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesController', PagesController);

    /** ngInject */
    function PagesController($scope,
        dataTableConfigService,
        PermissionService,
        PagesService,
        NotificationService,
        StatusService,
        ModalService,
        DateTimeHelper,
        $rootScope,
        $log) {
        var vm = $scope;
        var roleDelete = null;
        $log.info('PagesController');

        $rootScope.shownavbar = true;
        vm.status = [];
        vm.pages = [];
        vm.currentPage = 1;
        vm.remove = _remove;
        vm.changePage = _changePage;
        vm.canDelete = null;
        vm.canPost = null;
        vm.canPut = _canPut;

        function onInit() {
            StatusService
                .getStatus()
                .then(function (data) {
                    vm.status = data.data;
                });
            vm.convertDate = DateTimeHelper.convertDate;
            _loadPages();
        }

        function _loadPages(page) {
            PagesService
                .getPages(page)
                .then(function (data) {
                    vm.pages = data.data;
                    vm.dtOptions = dataTableConfigService.init();
                    _permissions();
                });
        }

        function _changePage() {
            _loadPages(vm.currentPage);
        }

        function _remove(id, title) {
            ModalService
                .confirm('Você deseja excluir a página <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    PagesService
                        .removePage(id)
                        .then(function () {
                            NotificationService.success('Página removida com sucesso.');
                            _loadPages();
                        });
                });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost(){
            vm.canPost = PermissionService.canPost('page');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('page');
        }

        function _canPut(id){
            vm.canDelete = PermissionService.canPut('page', id);
        }

        onInit();
    }
})();
