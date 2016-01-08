;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('CalendarService', [
      '$http',
      '$q',
      'SerializeService',
      'apiUrl',
      function ($http, $q, SerializeService, apiUrl) {
        clog('... CalendarService');

        var week = [
          'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
        ];

        var calendario = [];

        return {
          convertDate: function (date) {
            return new Date(date);
          },
          dateToStr: function (date) {
            Date.prototype.yyyymmdd = function () {
              var yyyy = this.getFullYear().toString();
              var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
              var dd = this.getDate().toString();

              if (dd[1]) {
                return dd+'/'+(mm[1] ? mm : "0"+mm[0])+'/'+yyyy;
              }

              return "0"+dd[0]+'/'+(mm[1] ? mm : "0"+mm[0])+'/'+yyyy;
            };
            var d = new Date(date);
            return d.yyyymmdd();
          },
          getWeekDay: function (date) {
            var d = new Date(date);
            var n = week[d.getDay()];
            return n;
          },
          updateCalendar: function (calendar) {
            // put
            var new_calendar = {
              description: calendar.description,
              regional: parseInt(calendar.regional),
              init_date: calendar.init_date,
              end_date: calendar.end_date,
              highlight: calendar.highlight
            };

            var serializeObject = new SerializeService(new_calendar),
              deferred = $q.defer();
            $http.put(apiUrl+'/calendar/'+calendar.id, serializeObject, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              .then(function (data) {
                deferred.resolve(data);
              });
            return deferred.promise;
          },
          postCalendar: function (data) {
            // post
            var deferred = $q.defer();
            $http.post(apiUrl+'/calendar', data).then(function (data) {
              deferred.resolve(data);
            });
            return deferred.promise;
          },
          removeCalendar: function (id) {
            // del
            var deferred = $q.defer();
            $http.delete(apiUrl+'/calendar'+'/'+id).then(function (data) {
              deferred.resolve(data);
            });
            return deferred.promise;
          },
          convertMonthStr: function (period) {
            var months = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
              'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            return months[parseInt(period) - 1];
          },
          convertPeriodStr: function (period) {
            var months = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
              'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            var trimmed = period.split('/');
            var month = trimmed[0] - 1;
            var year = trimmed[1];

            return months[month]+' / '+year;
          },
          getCalendar: function () {
            var deferred = $q.defer();

            $http.get(apiUrl+'/calendar').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getRegional: function () {
            var deferred = $q.defer();

            $http.get(apiUrl+'/regional').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getSchoolDays: function () {
            var deferred = $q.defer();

            $http.get(apiUrl+'/period').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          updatePeriod: function (period) {
            var new_period = {
              month: period.month,
              school_days: period.school_days,
              school_saturdays: period.school_saturdays,
              year: period.year,
              regional: parseInt(period.regional)
            };
            var serializeObject = new SerializeService(new_period);
            var deferred = $q.defer();

            $http.post(apiUrl+'/period/', serializeObject, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
