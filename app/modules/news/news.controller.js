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
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('NoticiasController');

        var vm = $scope;

        vm.news = [];
        vm.currentPage = 1;
        vm.convertDate = DateTimeHelper.dateToStr;
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

            function getNews(params, fnCallback) {
                NewsService
                    .getNews(dataTableConfigService.getParams(params))
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
            vm.canPut = PermissionService.canPut('news');
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('news');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('news');
        }
        onInit();
    }
})();
