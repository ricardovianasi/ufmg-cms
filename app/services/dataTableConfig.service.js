(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('dataTableConfigService', dataTableConfigService);

    /** ngInject */
    function dataTableConfigService(DTOptionsBuilder, DTColumnDefBuilder, $log, BuildParamsService, Util) {
        $log.info('dataTableConfigService');
        var paramStatus = 'all';
        var filterIndex = 0;
        var conditionsIndex = 0;
        var columnsHasOrder = [];

        return {
            dtOptionsBuilder: _dtOptionsBuilder,
            getParams: _getParams,
            columnBuilder: _columnBuilder,
            getOrderBy: _getOrderBy,
            setParamStatus: _setParamStatus,
            setColumnsHasOrderAndSearch: setColumnsHasOrderAndSearch
        };

        function setColumnsHasOrderAndSearch(columns) {
            columnsHasOrder = columns;
        }

        function _getParamsFilter() {
            let parametersFilter = '';
            for (var i = 0; i < columnsHasOrder.length; i++) {
                var element = columnsHasOrder[i];
                if (element.filter && (element.filter === 'type' || element.filter === 'author' || element.filter === 'genres')) {
                    filterIndex++;
                    parametersFilter += BuildParamsService.getInnerJoin(filterIndex, element.filter);
                }
            }
            return parametersFilter;
        }

        function _getParams(params, elementSearch) {
            var parameters = '?';
            if (angular.isUndefined(elementSearch)) {
                Util.goTop();
            }
            if (params.page) {
                parameters += 'page=' + params.page;
            }
            if (params.page_size) {
                parameters += '&page_size=' + params.page_size;
            }
            parameters += _getParamsFilter();

            if (paramStatus) {
                parameters += _getStatusParam(paramStatus);
            }
            if (params.order_by) {
                parameters += _getOrderByParam(params.order_by);
            }
            if (params.search) {
                parameters += _getSearchParam(params.search, elementSearch);
            }
            filterIndex = 0;
            conditionsIndex = 0;
            return parameters;
        }

        function _setColumnNotSortable(index) {
            return DTColumnDefBuilder.newColumnDef(index).notSortable();
        }

        function _setColumnSortable(index) {
            return DTColumnDefBuilder.newColumnDef(index);
        }

        function _verifyNotSortables(i, notSortables) {
            for (var j = 0; j < notSortables.length; j++) {
                if (i === notSortables[j]) {
                    return _setColumnNotSortable(i);
                }
            }
            return _setColumnSortable(i);
        }

        function _getOrderBy(columns, order) {
            var orderBy = '';
            if (order[0]) {
                for (var j = 0; j < columns.length; j++) {
                    var element = columns[j];
                    if (element.index === order[0].column) {
                        orderBy = BuildParamsService.getObjOrderBy(element.name, order[0].dir.toUpperCase(), element.filter);
                    }
                }
            } else {
                for (var k = 0; k < columnsHasOrder.length; k++) {
                    var el = columnsHasOrder[k];
                    let isOrderDate = el.name === 'postDate' || el.name === 'initDate' || el.name === 'publishDate';
                    let isOrderOrdinary = el.name === 'name' || el.name === 'title';
                    if (isOrderDate || isOrderOrdinary) {
                        let direction = isOrderDate ? 'DESC' : 'ASC';
                        orderBy = BuildParamsService.getObjOrderBy(el.name, direction, el.filter);
                        break;
                    }
                }
            }
            return orderBy;
        }

        function _columnBuilder(colunmsNumbers, notSortables) {
            var dtColumnDefBuilder = [];
            for (var e = 0; e < colunmsNumbers; e++) {
                if (angular.isDefined(notSortables)) {
                    dtColumnDefBuilder.push(_verifyNotSortables(e, notSortables));
                } else {
                    dtColumnDefBuilder.push(_setColumnSortable(e));
                }
            }
            return dtColumnDefBuilder;
        }

        function _setParamStatus(status) {
            paramStatus = status;
        }

        function _getOrderByParam(order) {
            if (!order) {
                return '';
            }
            filterIndex++;
            if (order.filter === 'author' || order.filter === 'type' || order.filter === 'genres') {
                return BuildParamsService.getParamToOrderBy('field', order.field, order.direction, order.filter, filterIndex);
            }
            return BuildParamsService.getParamToOrderBy('field', order.field, order.direction, '', filterIndex);

        }

        function _getSearchParam(search, elementSearch) {
            if (!search) {
                return '';
            }
            filterIndex++;
            let searchWildCard = BuildParamsService.wildcard(search);
            if (angular.isDefined(elementSearch)) {
                return BuildParamsService.getParamToSearch('like', elementSearch, searchWildCard, '', 'and', filterIndex);
            }
            if (columnsHasOrder.length === 1) {
                return BuildParamsService.
                    getParamToSearch('like', columnsHasOrder[0].name, searchWildCard, '', 'and', filterIndex);
            }
            conditionsIndex = 0;
            var searchParam = BuildParamsService.getQueryFilter(filterIndex) + BuildParamsService.getElement('type', 'orx');
            for (var i = 0; i < columnsHasOrder.length; i++) {
                var element = columnsHasOrder[i];
                if (element.name === 'postDate' || element.name === 'initDate' || element.name === 'publishDate') {
                    var isDate = Util.getDateBetween(search);
                    if (isDate) {
                        conditionsIndex++;
                        let params = [ {name: 'type', value: 'between'}, {name: 'field', value: element.name},
                            {name: 'from', value: isDate.from}, {name: 'to', value: isDate.to},
                            {name: 'format', value: 'Y-m-d H:i:s'}, {name: 'where', value: 'or'} ];
                        searchParam += BuildParamsService.getParamsFilter(params, filterIndex, conditionsIndex);
                    }
                } else if (element.filter) {
                    conditionsIndex++;
                    searchParam += BuildParamsService.getParamToSearch(
                        'like', element.name, searchWildCard, element.filter, 'or', filterIndex, conditionsIndex);
                } else {
                    conditionsIndex++;
                    searchParam += BuildParamsService
                        .getParamToSearch('like', element.name, searchWildCard, '', 'or', filterIndex, conditionsIndex);
                }
            }
            searchParam += BuildParamsService.getQueryFilter(filterIndex) + BuildParamsService.getElement('where', 'and');
            return searchParam;
        }

        function _getStatusParam(paramStatus) {
            if (!paramStatus || paramStatus === 'all') {
                return '';
            }
            filterIndex++;
            return BuildParamsService.getParamToSearch('eq', 'status', paramStatus, '', 'and', filterIndex);
        }

        function _dtOptionsBuilder(getContextCallback, options) {
            if (!options) {
                options = {};
            }
            return DTOptionsBuilder
                .newOptions()
                .withOption('processing', false)
                .withOption('serverSide', true)
                .withOption('searchDelay', 1000)
                .withOption('aaSorting', [])
                .withOption('bLengthChange', !!!options.displayLength)
                .withDataProp('data')
                .withFnServerData(function (sSource, aoData, fnCallback, oSettings) {
                    var currentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
                    var draw = aoData[0].value;
                    var order = aoData[2].value;
                    var length = aoData[4].value;
                    var search = aoData[5].value.value;

                    var params = {
                        draw: draw,
                        page: currentPage,
                        page_size: length,
                        search: search,
                        order_by: _getOrderBy(columnsHasOrder, order)
                    };
                    getContextCallback(params, fnCallback);
                })
                .withDisplayLength(options.displayLength || 25)
                .withPaginationType(options.paginationType || 'full_numbers')
                .withBootstrap()
                .withLanguage({
                    'sEmptyTable': 'Nenhum dado foi encontrado.',
                    'sInfo': 'Exibindo de _START_ a _END_ de _TOTAL_ resultados',
                    'sInfoEmpty': 'Exibindo de 0 a 0 de 0 resultados',
                    'sInfoFiltered': '(Filtrado de _MAX_ resultados)',
                    'sInfoPostFix': '',
                    'sInfoThousands': ',',
                    'sLengthMenu': 'Exibir _MENU_ resultados',
                    'sLoadingRecords': '<img src="assets/img/loading.gif"> <br />Carregando',
                    'sProcessing': '<img src="assets/img/loading.gif"> <br />Carregando',
                    'sSearch': '<i class="fa fa-search"></i>',
                    'searchPlaceholder': 'Pesquisar por...',
                    'sZeroRecords': '',
                    'oPaginate': {
                        'sFirst': '<i class="fa fa-angle-double-left"></i>',
                        'sPrevious': '<i class="fa fa-angle-left "></i>',
                        'sNext': '<i class="fa fa-angle-right "></i>',
                        'sLast': '<i class="fa fa-angle-double-right "></i>',
                    },
                    'oAria': {
                        'sSortAscending': ': filtro ascendente ativo',
                        'sSortDescending': ': filtro descendente ativo'
                    }
                });
        }
    }
})();
