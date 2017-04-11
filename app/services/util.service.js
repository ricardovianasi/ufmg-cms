(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('Util', Util);

    /** ngInject */
    function Util($log) {
        $log.info('Util');
        return {
            restoreOverflow: restoreOverflow,
            hiddenOverflow: hiddenOverflow,
            goTop: goTop,
            getDateBetween: getDateBetween
        };

        function restoreOverflow() {
            $('html, body')
                .css({
                    overflowY: 'auto',
                    height: 'auto'
                });
        }

        function hiddenOverflow() {
            $('html, body')
                .css({
                    overflowY: 'hidden',
                    height: '100%'
                });
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
                var yearMonth = {};
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
