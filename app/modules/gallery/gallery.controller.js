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
        $log) {
        $log.info('GaleriasController');
        $rootScope.shownavbar = true;

        $scope.galleries = [];
        $scope.status = [];
        $scope.currentPage = 1;
        $scope.DateTimeHelper = DateTimeHelper;

        var loadGalleries = function (page) {
            GalleryService
                .getGalleries(page)
                .then(function (data) {
                    $scope.galleries = data.data;
                    $scope.dtOptions = dataTableConfigService.init();
                    _permissions();
                });
        };

        loadGalleries();

        $scope.changePage = function () {
            loadGalleries($scope.currentPage);
        };

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        $scope.removeGallery = function (id, name) {
            ModalService
                .confirm('Você deseja excluir a galeria "' + name + '"?')
                .result
                .then(function () {
                    GalleryService.removeGallery(id).then(function () {
                        NotificationService.success('Galeria removida com sucesso.');
                        $route.reload();
                    });
                });
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            $scope.canPost = PermissionService.canPost('gallery');
        }

        function _canDelete() {
            $scope.canDelete = PermissionService.canDelete('gallery');
        }
    }
})();
