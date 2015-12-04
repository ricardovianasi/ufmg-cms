;(function () {
  'use strict';

  angular.module('HelperModule')
    .factory('DateTimeHelper', [
      '$filter',
      function ($filter) {
        'use strict';

        /**
         * @param {number} from
         * @param {number} to
         * @param {boolean} str
         *
         * @returns {Array}
         *
         * @private
         */
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
          /**
           * @param {string|Date} date
           * @param {boolean} time
           * @param {boolean} obj
           *
           * @returns {string}
           */
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
          /**
           * @param {string|Date} date
           * @param {boolean} time
           * @param {boolean} obj
           *
           * @returns {string}
           */
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
          /**
           * Options for angular-datepicker
           *
           * @returns {*}
           */
          getDatepickerOpt: function () {
            return {
              dateOptions: {
                formatYear: 'yyyy',
                startingDay: 0,
                showWeeks: false
              },
              /**
               * @param {*} $scope
               * @param {string} elem
               * @param {string} source
               */
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
              maxDate: new Date(2020, 5, 22),
              /**
               * @param {*} $scope
               * @param {*} $event
               * @param {string} source
               */
              open: function ($scope, $event, source) {
                var elem = $event.currentTarget.id;

                $scope.datepickerOpt[elem].toggleMin($scope, elem, source);
                $scope.datepickerOpt[elem].status = {
                  opened: true
                };
              },
              format: 'dd/MM/yyyy',
              events: [
                {
                  date: (new Date()).setDate((new Date()).getDate() + 1),
                  status: 'full'
                },
                {
                  date: (new Date()).setDate((new Date()).getDate() + 2),
                  status: 'partially'
                }
              ]
            };
          },
          /**
           * Options for angular-timepicker
           *
           * @returns {*}
           */
          getTimepickerOpt: function () {
            return {
              myTime: new Date(),
              isMeridian: false,
              /**
               * @param {*} $scope
               * @param {number} hour
               * @param {number} minute
               */
              update: function ($scope, hour, minute) {
                var newDate = new Date();

                newDate.setHours(hour);
                newDate.setTime(minute);

                $scope.timepickerOpt.myTime = newDate;
              },
              /**
               * @param {*} $scope
               */
              clear: function ($scope) {
                $scope.datepickerOpt.myTime = null;
              }
            };
          },
          /**
           * @returns {Array}
           */
          getDays: function () {
            return _makeRange(1, 31, true);
          },
          /**
           * @returns {Array}
           */
          getMonths: function () {
            return _makeRange(1, 12, true);
          },
          /**
           * @returns {Array}
           */
          getHours: function () {
            return _makeRange(0, 23, true);
          },
          /**
           * @returns {Array}
           */
          getMinutes: function () {
            return _makeRange(0, 59, true);
          },
          /**
           * @param date
           *
           * @returns {Date}
           */
          convertDate: function (date) {
            return new Date(date);
          },
          /**
           *
           * @param date
           * @returns {padding}
           */
          dateToStr: function (date) {
            var d = new Date(date);

            return $filter('date')(d, 'dd/MM/yyyy');
          }
        };
      }
    ]);
})();
