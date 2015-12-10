;(function () {
  'use strict';

  angular.module('calendarModule')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = [
    '$scope',
    'CalendarService',
    '$uibModal',
    '$http',
    '$timeout',
    'SerializeService',
    'NotificationService',
    'StatusService'
  ];

  function CalendarController($scope,
                              CalendarService,
                              $modal,
                              $http,
                              $timeout,
                              SerializeService,
                              NotificationService,
                              StatusService) {
    console.log('... CalendarioController');

    $scope.calendar = [];
    $scope.period_filter = [];
    $scope.active_period_filter = '';

    $scope.status = [];
    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    var loadCalendar = function () {
      CalendarService.getCalendar().then(function (data) {
        $scope.calendar = data.data;

        angular.forEach(data.data, function (calendar_item) {
          $scope.period_filter.push(calendar_item.period);
        });

        $scope.period_filter = _.uniq($scope.period_filter);
        $scope.active_period_filter = $scope.period_filter[0];
      });
    };

    loadCalendar();

    $scope.convertDate = function (date) {
      return CalendarService.convertDate(date);
    };

    $scope.convertPeriodStr = function (date) {
      return CalendarService.convertPeriodStr(date);
    };

    $scope.convertMonthStr = function (date) {
      return CalendarService.convertMonthStr(date);
    };

    $scope.getWeekDay = function (date) {
      return CalendarService.getWeekDay(date);
    };

    $scope.schoolDays = [];
    $scope.regional = [];

    CalendarService.getSchoolDays().then(function (data) {
      $scope.schoolDays = data.data;
    });

    CalendarService.getRegional().then(function (data) {
      $scope.regional = data.data;
    });

    $scope.diasLetivos = function (size) {
      var modalCalendarSchoolDays = $modal.open({
        templateUrl: '/components/modal/calendar.school-days.modal.template.html',
        controller: modalCalendarSchoolDaysCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          schoolDays: function () {
            return $scope.schoolDays;
          },
          regional: function () {
            return $scope.regional;
          }
        }
      });

      modalCalendarSchoolDays.result.then(function (data) {
        CalendarService.getSchoolDays().then(function (res) {
          $scope.schoolDays = res.data;
        });
      });
    };

    $scope.addEvent = function (size) {
      var modalCalendarioNovo = $modal.open({
        templateUrl: '/components/modal/calendario.novo.modal.template.html',
        controller: ModalCalendarioNovoCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          type: function () {
            return 'add';
          },
          regional: function () {
            return $scope.regional;
          }
        }
      });
    };

    var removeConfirmationModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $modal.open({
        templateUrl: '/components/modal/confirmation.modal.template.html',
        controller: ConfirmationModalCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          title: function () {
            return title;
          }
        }
      });
    };

    var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
      $scope.modal_title = title;

      $scope.ok = function () {
        $uibModalInstance.close();
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.editEvent = function (size, event) {
      var modalCalendarEditEvent = $modal.open({
        templateUrl: '/components/modal/calendario.novo.modal.template.html',
        controller: ModalEditEventCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          type: function () {
            return 'edit';
          },
          regional: function () {
            return $scope.regional;
          },
          event: function () {
            return event;
          }
        }
      });

      modalCalendarEditEvent.result.then(function (data) {
        CalendarService.getCalendar().then(function (res) {
          $scope.calendar = res.data;
        });
      });
    };

    $scope.removeEvent = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir o evento "' + description + '"?');
      removeConfirmationModal.result.then(function (data) {
        CalendarService.removeCalendar(id).then(function (data) {
          NotificationService.success('Evento removido com sucesso.');
          loadCalendar();
        });
      });
    };

    var ModalEditEventCtrl = function ($scope, $http, $uibModalInstance, regional, event, type) {
      $scope.type = type;

      var new_init_date = CalendarService.convertDate(event.init_date);
      var new_end_date = CalendarService.convertDate(event.end_date);

      $scope.regional = regional;
      $scope.newRegister = {};
      $scope.newRegister.id = event.id;
      $scope.newRegister.regional = event.regional ? event.regional.id : '';
      $scope.newRegister.description = event.description;
      $scope.newRegister.init_date = event.init_date ? CalendarService.dateToStr(new_init_date) : '';
      $scope.newRegister.end_date = event.end_date ? CalendarService.dateToStr(new_end_date) : '';
      $scope.newRegister.highlight = event.highlight;

      $scope.ok = function () {
        CalendarService.updateCalendar($scope.newRegister).then(function (data) {
          if (data.status == '200') {
            NotificationService.success('Evento atualizado com sucesso.');
          }

          $uibModalInstance.close();
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    var modalCalendarSchoolDaysCtrl = function ($scope, $http, $uibModalInstance, schoolDays, regional) {
      $scope.convertMonthStr = function (period) {
        var months = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
          'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        return months[parseInt(period) - 1];
      };

      $scope.time_months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      $scope.time_years = ['2015', '2016', '2017'];
      $scope.regional = regional;
      $scope.schoolDays = schoolDays;
      $scope.months = [];

      angular.forEach($scope.schoolDays.items, function (data) {
        $scope.months.push(data.period);
      });

      $scope.months = _.uniq($scope.months);
      $scope.convertPeriodStr = function (date) {
        return CalendarService.convertPeriodStr(date);
      };

      $scope.period = {
        id: '',
        month: '',
        year: '',
        regional: '',
        school_days: '',
        school_saturdays: ''
      };

      $scope.periodUpdate = function (month, year, regional_id) {
        if (month && year && regional_id) {
          var filtered_month = _.filter($scope.schoolDays.items, function (b) {
            if (b.month == month && b.year == year && b.regional.id == parseInt(regional_id)) {
              return b;
            }
          });

          $timeout(function () {
            if (filtered_month[0]) {
              $scope.period.school_days = filtered_month[0].school_days;
              $scope.period.school_saturdays = filtered_month[0].school_saturdays;
            } else {
              $scope.period.school_days = '';
              $scope.period.school_saturdays = '';
            }
          });
        }
      };

      $scope.ok = function () {
        CalendarService.updatePeriod($scope.period).then(function (data) {
          $uibModalInstance.close();
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    var ModalCalendarioNovoCtrl = function ($scope, $uibModalInstance, regional, type) {
      $scope.type = type;
      $scope.regional = regional;
      $scope.newRegister = {
        description: '',
        init_date: '',
        end_date: '',
        highlight: false
      };

      $scope.ok = function () {
        CalendarService.postCalendar($scope.newRegister).then(function (data) {
          $uibModalInstance.close();
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };
  }
})();
