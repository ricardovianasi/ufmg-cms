(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('dataTableConfigService', dataTableConfigService);

    /** ngInject */
    function dataTableConfigService(DTOptionsBuilder, DTColumnDefBuilder, $log, $timeout, Util) {
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

        function hasAuthor() {
            filterIndex++;
            for (var i = 0; i < columnsHasOrder.length; i++) {
                var element = columnsHasOrder[i];
                if (element.filter === 'author') {
                    return '&query[filter][' + filterIndex + '][type]=innerjoin' +
                        '&query[filter][' + filterIndex + '][field]=author' +
                        '&query[filter][' + filterIndex + '][alias]=author';
                }
            }
            return '';
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
            parameters += hasAuthor();
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
                        orderBy = {
                            field: element.name,
                            direction: order[0].dir.toUpperCase(),
                            filter: element.filter
                        };
                    }
                }
            } else {
                var isNotOrder = true;
                for (var k = 0; k < columnsHasOrder.length; k++) {
                    var el = columnsHasOrder[k];
                    if (el.name === 'postDate' || el.name === 'initDate' || el.name === 'publishDate') {
                        orderBy = {
                            field: el.name,
                            direction: 'DESC',
                            filter: el.filter
                        };
                        isNotOrder = false;
                        break;
                    }
                }
                if (isNotOrder) {
                    for (var f = 0; f < columnsHasOrder.length; f++) {
                        var ele = columnsHasOrder[f];
                        if (ele.name === 'name' || ele.name === 'title') {
                            orderBy = {
                                field: ele.name,
                                direction: 'ASC',
                                filter: ele.filter
                            };
                            break;
                        }
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
            if (order.filter === 'author') {
                return '&query[order_by][' + filterIndex + '][type]=field' +
                    '&query[order_by][' + filterIndex + '][field]=' + order.field +
                    '&query[order_by][' + filterIndex + '][direction]=' + order.direction +
                    '&query[order_by][' + filterIndex + '][alias]=author';
            }
            return '&query[order_by][' + filterIndex + '][type]=field' +
                '&query[order_by][' + filterIndex + '][field]=' + order.field +
                '&query[order_by][' + filterIndex + '][direction]=' + order.direction;
        }

        function wildcard(el) {
            var element = Number(el);
            if (!isNaN(element)) {
                return element;
            }
            return '%\\' + el + '%';
        }

        function _getSearchParam(search, elementSearch) {
            if (!search) {
                return '';
            }
            filterIndex++;
            if (angular.isDefined(elementSearch)) {
                return '&query[filter][' + filterIndex + '][type]=like' +
                    '&query[filter][' + filterIndex + '][field]=' + elementSearch +
                    '&query[filter][' + filterIndex + '][value]=' + wildcard(search) +
                    '&query[filter][' + filterIndex + '][where]=and';
            }
            if (columnsHasOrder.length === 1) {
                return '&query[filter][' + filterIndex + '][type]=like' +
                    '&query[filter][' + filterIndex + '][field]=' + columnsHasOrder[0].name +
                    '&query[filter][' + filterIndex + '][value]=' + wildcard(search) +
                    '&query[filter][' + filterIndex + '][where]=and';
            }
            conditionsIndex = 0;
            var searchParam = '&query[filter][' + filterIndex + '][type]=orx';
            for (var i = 0; i < columnsHasOrder.length; i++) {
                var element = columnsHasOrder[i];
                if (element.name === 'postDate' || element.name === 'initDate' || element.name === 'publishDate') {
                    var isDate = Util.getDateBetween(search);
                    if (isDate) {
                        conditionsIndex++;
                        searchParam += '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][type]=between' +
                            '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][field]=' + element.name +
                            '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][from]=' + isDate.from +
                            '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][to]=' + isDate.to +
                            '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][format]=Y-m-d H:i:s' +
                            '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][where]=or';
                    }
                } else if (element.filter === 'author') {
                    conditionsIndex++;
                    searchParam += '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][type]=like' +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][field]=' + element.name +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][value]=' + wildcard(search) +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][alias]=author' +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][where]=or';
                } else {
                    conditionsIndex++;
                    searchParam += '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][type]=like' +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][field]=' + element.name +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][value]=' + wildcard(search) +
                        '&query[filter][' + filterIndex + '][conditions][' + conditionsIndex + '][where]=or';
                }
            }
            searchParam += '&query[filter][' + filterIndex + '][where]=and';
            return searchParam;
        }

        function _getStatusParam(paramStatus) {
            if (!paramStatus || paramStatus === 'all') {
                return '';
            }
            filterIndex++;
            return '&query[filter][' + filterIndex + '][type]=eq' +
                '&query[filter][' + filterIndex + '][field]=status' +
                '&query[filter][' + filterIndex + '][value]=' + paramStatus +
                '&query[filter][' + filterIndex + '][where]=and';
        }

        function _dtOptionsBuilder(getContextCallback, options) {
            if (!options) {
                options = {};
            }
            return DTOptionsBuilder
                .newOptions()
                .withOption('processing', false)
                .withOption('serverSide', true)
                .withOption('searchDelay', 800)
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
