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
            getInnerJoin: getInnerJoin,
            getQueryFilter: getQueryFilter,
            getQuery: getQuery,
            getElement: getElement,
            wildcard: wildcard,
            getObjOrderBy: getObjOrderBy,
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
            return getQueryFilter(filterIndex, conditionsIndex) + getElement('type', type) +
                getQueryFilter(filterIndex, conditionsIndex) + getElement('field', field) +
                getQueryFilter(filterIndex, conditionsIndex) + getElement('value', value) +
                (alias ?
                    getQueryFilter(filterIndex, conditionsIndex) + getElement('alias', alias) : '') +
                getQueryFilter(filterIndex, conditionsIndex) + getElement('where', where);
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