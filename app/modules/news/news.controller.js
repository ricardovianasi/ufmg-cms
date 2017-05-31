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
        $routeParams,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('NoticiasController');

        var vm = $scope;
        vm.typeNews = $routeParams.typeNews;

        vm.news = [];
        vm.currentPage = 1;
        vm.convertDate = DateTimeHelper.dateToStr;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

        function onInit() {
            var typeNews = $routeParams.typeNews;
            if (typeNews === 'agencia-de-noticias') {
                vm.typeNewsPermission = 'news_agencia_de_agencia';
            } else if (typeNews === 'tv') {
                vm.typeNewsPermission = 'news_tv';
            } else if (typeNews === 'radio') {
                vm.typeNewsPermission = 'news_radio';
            }
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

            function getNews(params, fnCallback) {
                NewsService
                    .getNews(dataTableConfigService.getParams(params), vm.typeNews)
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.news = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getNews);
        }

        vm.removeNews = function (id, title) {
            ModalService
                .confirm('Você deseja excluir a notícia <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    NewsService.removeNews(id).then(function () {
                        vm.dtInstance.DataTable.draw();
                        NotificationService.success('Notícia removida com sucesso.');
                    });
                });
        };

        function _permissions() {
            _canDelete();
            _canPost();
            _canPut();
        }

        function _canPut() {
            console.log(vm.typeNewsPermission);
            vm.canPut = PermissionService.canPut(vm.typeNewsPermission);
        }

        function _canPost() {
            console.log(vm.typeNewsPermission);
            vm.canPost = PermissionService.canPost(vm.typeNewsPermission);
        }

        function _canDelete() {
            console.log(vm.typeNewsPermission);
            vm.canDelete = PermissionService.canDelete(vm.typeNewsPermission);
        }
        onInit();
    }
})();
