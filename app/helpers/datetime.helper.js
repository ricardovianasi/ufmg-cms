(function () {
    'use strict';

    angular.module('helperModule')
        /** ngInject */
        .factory('DateTimeHelper', function ($filter, $log) {
            $log.info('DateTimeHelper');

            var _makeRange = function (from, to, str) {
                var range = [];

                from = from || 0;
                to = to || 0;

                for (var i = from; i <= to; i++) {
                    var num = i;

                    if (i <= 9 && typeof str !== 'undefined') {
                        num = '0' + i;
                    }

                    range.push(num);
                }

                return range;
            };

            return {
                toBrStandard: function (date, time, obj) {
                    var d = date;

                    if (typeof date === 'string') {
                        d = new Date(date);
                    }

                    if (typeof time !== 'undefined') {
                        if (obj) {
                            return {
                                date: $filter('date')(d, 'dd/MM/yyyy'),
                                time: $filter('date')(d, 'HH:mm')
                            };
                        }

                        return $filter('date')(d, 'dd/MM/yyyy HH:mm');
                    }

                    if (obj) {
                        return {
                            date: $filter('date')(d, 'dd/MM/yyyy')
                        };
                    }

                    return $filter('date')(d, 'dd/MM/yyyy');
                },
                toUsStandard: function (date, time, obj) {
                    var d = date;

                    if (typeof date === 'string') {
                        d = new Date(date);
                    }

                    if (typeof time !== 'undefined') {
                        if (obj) {
                            return {
                                date: $filter('date')(d, 'yyyy-MM-dd'),
                                time: $filter('date')(d, 'HH:mm')
                            };
                        }

                        return $filter('date')(d, 'yyyy-MM-dd HH:mm');
                    }

                    if (obj) {
                        return {
                            date: $filter('date')(d, 'yyyy-MM-dd')
                        };
                    }

                    return $filter('date')(d, 'yyyy-MM-dd');
                },
                getDatepickerOpt: function () {
                    return {
                        dateOptions: {
                            formatYear: 'yyyy',
                            startingDay: 0,
                            showWeeks: false
                        },
                        toggleMin: function ($scope, elem, source) {
                            var minDate = null;

                            if (!$scope.datepickerOpt[elem].minDate) {
                                minDate = new Date();

                                if (source) {
                                    minDate = new Date($scope.event[source]);
                                }
                            }

                            $scope.datepickerOpt[elem].minDate = minDate;
                        },
                        open: function ($scope, $event, source) {
                            var elem = $event.currentTarget.id;

                            $scope.datepickerOpt[elem].toggleMin($scope, elem, source);
                            $scope.datepickerOpt[elem].status = {
                                opened: true
                            };
                        },
                        format: 'dd/MM/yyyy',
                        events: [{
                            date: (new Date()).setDate((new Date()).getDate() + 1),
                            status: 'full'
                        }, {
                            date: (new Date()).setDate((new Date()).getDate() + 2),
                            status: 'partially'
                        }]
                    };
                },
                getTimepickerOpt: function () {
                    return {
                        myTime: new Date(),
                        isMeridian: false,
                        update: function ($scope, hour, minute) {
                            var newDate = new Date();

                            newDate.setHours(hour);
                            newDate.setTime(minute);

                            $scope.timepickerOpt.myTime = newDate;
                        },
                        clear: function ($scope) {
                            $scope.datepickerOpt.myTime = null;
                        }
                    };
                },
                getDays: function () {
                    return _makeRange(1, 31, true);
                },
                getMonths: function (str) {
                    var monthsNumbers = _makeRange(1, 12, true);

                    if (str) {
                        var months = [];

                        angular.forEach(monthsNumbers, function (value, key) {
                            var date = new Date((new Date()).getFullYear(), key);

                            months.push(date.toLocaleString('pt-br', {
                                month: 'long'
                            }));
                        });

                        return months;
                    }

                    return monthsNumbers;
                },
                getHours: function () {
                    return _makeRange(0, 23, true);
                },
                getMinutes: function () {
                    return _makeRange(0, 59, true);
                },
                convertDate: function (date) {
                    return new Date(date);
                },
                dateToStr: function (date) {
                    var d = new Date(date);

                    return $filter('date')(d, 'dd/MM/yyyy');
                },
                yearRange: function (amount) {
                    amount = amount || 5;

                    var currentYear = (new Date()).getFullYear();

                    return _makeRange(currentYear - amount, currentYear + amount);
                }
            };
        });
})();
