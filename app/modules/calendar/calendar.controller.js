;
(function () {
    'use strict';

    angular.module('calendarModule')
        .controller('CalendarController', CalendarController);
    /** ngInject */
    function CalendarController($scope,
        CalendarService,
        $uibModal,
        PermissionService,
        $log,
        $timeout,
        dataTableConfigService,
        NotificationService,
        StatusService,
        ModalService,
        DateTimeHelper,
        $rootScope,
        $route,
        validationService) {

        $rootScope.shownavbar = true;
        $log.info('CalendarController');

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
                $scope.dtOptions = dataTableConfigService.init();

                angular.forEach(data.data.items, function (calendar_item) {
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
            $scope.regional = data.data.items;
        });

        $scope.diasLetivos = function (size) {
            var modalCalendarSchoolDays = $uibModal.open({
                templateUrl: 'components/modal/calendar.school-days.modal.template.html',
                controller: ModalCalendarSchoolDaysCtrl,
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
            var modalCalendarioNovo = $uibModal.open({
                templateUrl: 'components/modal/calendario.novo.modal.template.html',
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
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
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

        /**
         * @param $scope
         * @param $uibModalInstance
         * @param title
         *
         * @constructor
         */
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
            var modalCalendarEditEvent = $uibModal.open({
                templateUrl: 'components/modal/calendario.novo.modal.template.html',
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

        /**
         * @param $scope
         * @param $http
         * @param $uibModalInstance
         * @param regional
         * @param event
         * @param type
         *
         * @constructor
         */
        var ModalEditEventCtrl = function ($scope, $http, $uibModalInstance, regional, event, type, $route) {
            console.log('... ModalEditEventCtrl');

            $scope.type = type;

            var new_init_date = CalendarService.convertDate(event.init_date);
            var new_end_date = CalendarService.convertDate(event.end_date);

            $scope.regional = regional;
            $scope.newRegister = {};
            $scope.newRegister.id = event.id;
            $scope.newRegister.regional = event.regional.length == 2 ? '0' : String(event.regional[0].id);
            $scope.newRegister.description = event.description;
            $scope.newRegister.init_date = event.init_date ? CalendarService.dateToStr(new_init_date) : '';
            $scope.newRegister.end_date = event.end_date ? CalendarService.dateToStr(new_end_date) : '';
            $scope.newRegister.highlight = event.highlight;




            $scope.ok = function () {

                var newRegional = [];

                if ($scope.newRegister.regional === "0") {
                    angular.forEach(regional, function (v, k) {
                        newRegional.push(regional[k].id);
                    });

                    $scope.newRegister.regional = newRegional;
                }

                CalendarService.updateCalendar($scope.newRegister).then(function (data) {
                    if (data.status == '200') {
                        NotificationService.success('Evento atualizado com sucesso.');
                        $route.reload();
                    }

                    $uibModalInstance.close();
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        /**
         * @param $scope
         * @param $http
         * @param $uibModalInstance
         * @param schoolDays
         * @param regional
         *
         * @constructor
         */
        var ModalCalendarSchoolDaysCtrl = function ($scope, $http, $uibModalInstance, schoolDays, regional, validationService) {
            console.log('... ModalCalendarSchoolDaysCtrl');

            $scope.time_months = DateTimeHelper.getMonths(true);
            $scope.time_years = DateTimeHelper.yearRange();
            $scope.regional = regional;
            $scope.schoolDays = schoolDays;
            $scope.months = [];

            angular.forEach($scope.schoolDays.items, function (data) {
                $scope.months.push(data.period);
            });

            $scope.months = _.uniq($scope.months);

            /**
             * @param date
             *
             * @returns {*}
             */
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

            /**
             * @param month
             * @param year
             * @param regional_id
             */
            $scope.periodUpdate = function (month, year, regional_id) {
                if (month && year && regional_id) {
                    var filtered_month = _.filter($scope.schoolDays.items, function (b) {
                        if (b.month == month && b.year == year && b.regional.id == parseInt(regional_id)) {
                            return b;
                        }
                    });

                    $timeout(function () {
                        if (filtered_month[0]) {
                            $scope.hasPeriod = true;
                            $scope.period.school_days = filtered_month[0].school_days;
                            $scope.period.school_saturdays = filtered_month[0].school_saturdays;
                            $scope.period.id = filtered_month[0].id;
                        } else {
                            $scope.hasPeriod = false;
                            $scope.period.school_days = '';
                            $scope.period.school_saturdays = '';
                        }
                    });
                }
            };

            $scope.ok = function () {
                console.log('hasperiodo >>>>>>>>>>>', $scope.hasPeriod);
                if (!validationService.isValid($scope.formDays.$invalid))
                    return false;

                if ($scope.hasPeriod === true) {
                    CalendarService.updatePeriod($scope.period).then(function (data) {
                        $uibModalInstance.close();
                    });
                } else {
                    CalendarService.newPeriod($scope.period).then(function (data) {
                        $uibModalInstance.close();
                    });
                }

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        /**
         * @param $scope
         * @param $uibModalInstance
         * @param regional
         * @param type
         *
         * @constructor
         */
        var ModalCalendarioNovoCtrl = function ($scope, $uibModalInstance, regional, type, $route, validationService) {
            console.log('... ModalCalendarioNovoCtrl');

            $scope.type = type;
            $scope.regional = regional;
            $scope.newRegister = {
                description: '',
                init_date: '',
                end_date: '',
                highlight: false
            };

            $scope.ok = function () {

                if (!validationService.isValid($scope.formCalendar.$invalid))
                    return false;

                var newRegional = [];

                if ($scope.newRegister.regional === "0") {
                    angular.forEach(regional, function (v, k) {
                        newRegional.push(regional[k].id);
                    });

                    $scope.newRegister.regional = newRegional;
                }

                CalendarService.postCalendar($scope.newRegister).then(function (data) {
                    $route.reload();
                    $uibModalInstance.close();
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };
    }
})();
