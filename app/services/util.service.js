(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('Util', Util);

    /** ngInject */
    function Util(
        $log,
        $rootScope,
        $timeout,
        $q) {
        $log.info('Util');
        var filterIndex = 0;
        var conditionsIndex = 0;
        var columnsHasOrder = [];

        var mem = {};

        return {
            goTop: goTop,
            getDateBetween: getDateBetween,
            getParams: getParams,
            get: get,
            set: set,
            event: event
        };

        function event(event, data) {
            var defer = $q.defer();
            $rootScope.$emit('set' + event, data);
            $rootScope.$on('get' + event, function (event, data) {
                defer.resolve(data);
            });
            return defer.promise;
        }

        function set(key, value) {
            $rootScope.$emit('scope.setted', key);
            mem[key] = value;
        }

        function get(key) {
            return mem[key];
        }

        function getParams(params, elementSearch) {
            var parameters = '?';
            if (angular.isUndefined(elementSearch)) {
                goTop();
            }
            if (params.page) {
                parameters += 'page=' + params.page;
            }
            if (params.page_size) {
                parameters += '&page_size=' + params.page_size;
            }
            parameters += hasAuthor();
            if (params.filter) {
                parameters += _getCustomParam(params.filter);
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
                    var isDate = getDateBetween(search);
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

        function _getCustomParam(customFilter) {
            if (!customFilter || customFilter === '') {
                return '';
            }
            filterIndex++;
            return '&query[filter][' + filterIndex + '][type]=eq' +
                '&query[filter][' + filterIndex + '][field]=' + customFilter.field +
                '&query[filter][' + filterIndex + '][value]=' + customFilter.value +
                '&query[filter][' + filterIndex + '][where]=and';
        }

        function goTop() {
            $('html, body')
                .animate({
                    scrollTop: $('html').offset().top
                });
        }

        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        function verifyDay(el) {
            if (el.length === 2 || el.length === 1) {
                var day = Number(el);
                if (!isNaN(day) && day >= 1 && day <= 31) {
                    return day;
                }
            }
            return false;
        }

        function verifyMonth(el) {
            if (el.length === 2 || el.length === 1) {
                var month = Number(el);
                if (!isNaN(month) && month >= 1 && month <= 12) {
                    return month;
                }
            }
            return false;
        }

        function verifyYear(el) {
            if (el.length === 4) {
                var year = Number(el);
                if (!isNaN(year)) {
                    return year;
                }
            }
            return false;
        }

        function verifyYearMonthDay(date) {
            if (date.length >= 8 && date.length <= 10) {
                var day = '';
                var splited = date.split('-', 2);
                var yearMonth = verifyYearMonth(splited.join('-'));
                if (!yearMonth) {
                    splited = date.split('-');
                    yearMonth = verifyYearMonth(splited[1] + '-' + splited[2]);
                    day = splited[0];
                } else {
                    day = date.split('-', 3)[2];
                }
                if (yearMonth.year && yearMonth.month && verifyDay(day)) {
                    return {
                        year: yearMonth.year,
                        month: yearMonth.month,
                        day: day
                    };
                }
            }
            return false;
        }

        function verifyYearMonth(date) {
            if (date.length >= 5 && date.length <= 7) {
                var month;
                var year;
                var splited = date.split('-');

                for (var i = 0; i < splited.length; i++) {
                    var element = splited[i];
                    var _year = verifyYear(element);
                    if (_year) {
                        year = _year;
                        continue;
                    }
                    var _month = verifyMonth(element);
                    if (_month) {
                        month = _month;
                        continue;
                    }
                }
                if (year && month) {
                    return {
                        year: year,
                        month: month
                    };
                }
            }
            return false;
        }

        function getDateBetween(date) {
            var el = replaceAll(date, '/', '-');
            var fromDate;
            var toDate;
            var year = verifyYear(el);
            if (year) {
                fromDate = moment([year]);
                toDate = moment(fromDate).endOf('year');
            }
            var yearMonth = verifyYearMonth(el);
            if (yearMonth) {
                fromDate = moment([yearMonth.year, yearMonth.month - 1]);
                toDate = moment(fromDate).endOf('month');
            }
            var yearMonthDay = verifyYearMonthDay(el);
            if (yearMonthDay) {
                fromDate = moment(yearMonthDay.year + '-' + yearMonthDay.month + '-' + yearMonthDay.day, 'YYYY-MM-DD');
                toDate = moment(fromDate).endOf('day');
            }
            if (fromDate && toDate) {
                return {
                    from: fromDate.format('YYYY-MM-DD') + ' 00:00:00',
                    to: toDate.format('YYYY-MM-DD') + ' 23:59:59'
                };
            }
            return false;
        }
    }
})();
