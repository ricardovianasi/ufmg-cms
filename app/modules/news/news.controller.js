;
(function () {
    'use strict';

    angular.module('newsModule')
        .controller('NewsController', NewsController);

    /** ngInject */
    function NewsController($scope,
        dataTableConfigService,
        PermissionService,
        NewsService,
        NotificationService,
        DateTimeHelper,
        ModalService,
        $rootScope,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('NoticiasController');

        $scope.news = [];
        $scope.currentPage = 1;

        var loadNews = function (page) {
            NewsService.getNews(null, page).then(function (data) {
                $scope.news = data.data;
                $scope.dtOptions = dataTableConfigService.init();
            });
        };

        loadNews();

        $scope.changePage = function () {
            loadNews($scope.currentPage);
        };

        $scope.convertDate = DateTimeHelper.dateToStr;

        /**
         * @param id
         * @param title
         */
        $scope.removeNews = function (id, title) {
            ModalService
                .confirm('Você deseja excluir a notícia <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    NewsService.removeNews(id).then(function () {
                        NotificationService.success('Notícia removida com sucesso.');
                        loadNews();
                    });
                });
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('news');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('news');
        }
    }
})();
