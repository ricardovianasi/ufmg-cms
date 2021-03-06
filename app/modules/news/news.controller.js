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
        $log.info('NoticiasController');

        var vm = $scope;
        vm.typeNews = $routeParams.typeNews;

        vm.news = [];
        vm.currentPage = 1;
        vm.convertDate = DateTimeHelper.dateToStr;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;

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

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getNews);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

            function getNews(params, fnCallback) {
                NewsService
                    .getNews(dataTableConfigService.getParams(params), vm.typeNews)
                    .then(function (res) {
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
        }

        vm.removeNews = function (id, title) {
            ModalService
                .confirm('Você deseja excluir a notícia <b>' + title + '</b>?', ModalService.MODAL_MEDIUM, { isDanger: true })
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
        }
        function _canPost() {
            vm.canPost = PermissionService.canPost(vm.typeNews);
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete(vm.typeNews);
        }
        onInit();
    }
})();
