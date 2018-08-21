(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('BuildParamsService', BuildParamsService);

    /** ngInject */
    function BuildParamsService() {
        var service = {
            getParamToOrderBy: getParamToOrderBy,
            getParamToSearch: getParamToSearch,
            getParamsFilter: getParamsFilter,
            getInnerJoin: getInnerJoin,
            getQueryFilter: getQueryFilter,
            getQuery: getQuery,
            getElement: getElement,
            wildcard: wildcard,
            getObjOrderBy: getObjOrderBy,
            getPureElement: getPureElement,
        };
        
        return service;

        ////////////////

        function getParamToOrderBy(type, field, direction, alias, filterIndex) {
            return getQuery('order_by', filterIndex) + getElement('type', type) +
                getQuery('order_by', filterIndex) + getElement('field', field) +
                getQuery('order_by', filterIndex) + getElement('direction', direction) +
                (alias ? getQuery('order_by', filterIndex) + getElement('alias', alias) : '');
        }

        function getParamToSearch(type, field, value, alias, where, filterIndex, conditionsIndex) {
            let queryParams = [ 
                {name: 'type', value: type}, {name: 'field', value: field},
                {name: 'value', value: value}, alias ? { name: 'alias', value: alias } : undefined,
                {name: 'where', value: where}
            ];
            return getParamsFilter(queryParams, filterIndex, conditionsIndex);
        }

        function getParamsFilter(listQuery, filterIndex, conditionsIndex) {
            let params = '';
            listQuery.forEach(function(query) {
                if(query) {
                    params += getQueryFilter(filterIndex, conditionsIndex) + getElement(query.name, query.value);
                }
            });
            return params;
        }

        function getInnerJoin(index, field) {
            return getQueryFilter(index) + getElement('type', 'innerjoin') +
                getQueryFilter(index) + getElement('field', field) +
                getQueryFilter(index) + getElement('alias', field);
        }

        function getQueryFilter(filterIndex, conditionsIndex) {
            return getQuery('filter', filterIndex) + 
                (conditionsIndex ? '[conditions][' + conditionsIndex + ']' : '');
        }

        function getQuery(typeQuery, index) {
            return '&query[' + typeQuery + '][' + index + ']'; 
        }

        function getElement(name, value) {
            return  '[' + name + ']=' + value;
        }

        function getPureElement(listName, listValues) {
            var params = '';
            listName.forEach(function(name, idx) { 
                params += name + '=' + listValues[idx] + (idx + 1 < listValues.length ? '&' : '');
            });
            return params;
        }

        function wildcard(el) {
            // var element = Number(el);
            // if (!isNaN(element)) {
            //     return element;
            // }
            return '%\\' + el + '%';
        }

        function getObjOrderBy(field, direction, filter) {
            return { field: field, direction: direction, filter: filter };
        }
    }
})();