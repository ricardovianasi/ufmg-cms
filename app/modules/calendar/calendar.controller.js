(function () {
    'use strict';

    angular.module('calendarModule')
        .controller('CalendarController', CalendarController);
    /** ngInject */
    function CalendarController(
        $scope,
        CalendarService,
        $uibModal,
        PermissionService,
        $log,
        $timeout,
        dataTableConfigService,
        NotificationService,
        DateTimeHelper
    ) {
        $log.info('CalendarController');
        var _view = false;
        var vm = $scope;
        var removeConfirmationModal = {};
        var ModalEditEventCtrl = _ModalEditEventCtrl;
        var ModalCalendarSchoolDaysCtrl = _ModalCalendarSchoolDaysCtrl;
        var ModalCalendarioNovoCtrl = _ModalCalendarioNovoCtrl;
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;
        vm.canPost = false;

        onInit();

        function onInit() {
            vm.calendar = [];
            vm.period_filter = [];
            vm.active_period_filter = '';

            vm.status = [];
            vm.schoolDays = [];
            vm.regional = [];


            vm.changeStatus = _changeStatus;
            vm.itemStatus = 'all';
            vm.dtInstance = {};
            _renderDataTable();
        }

        function _changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            var numberOfColumns = 6;
            var columnsHasNotOrder = [3, 5];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'initDate'
            }, {
                index: 1,
                name: 'description'
            }, {
                index: 2,
                filter: 'author',
                name: 'name'
            }, {
                index: 4,
                name: 'initDate'
            }]);

            function getCalendar(params, fnCallback) {
                CalendarService
                    .getCalendar(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.calendar = res.data;
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

                        // angular.forEach(res.data.items, function (calendar_item) {
                        //     vm.period_filter.push(calendar_item.period);
                        // });

                        // vm.period_filter = _.uniq(vm.period_filter);
                        // vm.active_period_filter = vm.period_filter[0];
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        _permissions();
                        fnCallback(records);

                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getCalendar);
        }

        vm.convertDate = function (date) {
            return CalendarService.convertDate(date);
        };

        vm.convertPeriodStr = function (date) {
            return CalendarService.convertPeriodStr(date);
        };

        vm.convertMonthStr = function (date) {
            return CalendarService.convertMonthStr(date);
        };

        vm.getWeekDay = function (date) {
            return CalendarService.getWeekDay(date);
        };

        CalendarService.getSchoolDays().then(function (data) {
            vm.schoolDays = data.data;
        });

        CalendarService.getRegional().then(function (data) {
            vm.regional = data.data.items;
        });

        vm.diasLetivos = function (size) {
            var modalCalendarSchoolDays = $uibModal.open({
                templateUrl: 'components/modal/calendar.school-days.modal.template.html',
                controller: ModalCalendarSchoolDaysCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    schoolDays: function () {
                        return vm.schoolDays;
                    },
                    regional: function () {
                        return vm.regional;
                    }
                }
            });

            modalCalendarSchoolDays.result.then(function () {
                CalendarService.getSchoolDays().then(function (res) {
                    vm.schoolDays = res.data;
                });
            });
        };



        vm.confirmationModal = function (size, title) {
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

        function _ConfirmationModalCtrl($scope, $uibModalInstance, title) {
            var vm = $scope;
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        vm.addEvent = function (size) {
            _view = false;
            $uibModal.open({
                templateUrl: 'components/modal/calendario.novo.modal.template.html',
                controller: ModalCalendarioNovoCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    type: function () {
                        return 'add';
                    },
                    regional: function () {
                        return vm.regional;
                    }
                }
            });
        };

        vm.editEvent = function (size, event, view) {
            if (view) {
                _view = view;
            }
            var modalCalendarEditEvent = $uibModal.open({
                templateUrl: 'components/modal/calendario.novo.modal.template.html',
                controller: ModalEditEventCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    type: function () {
                        if (view) {
                            return 'view';
                        }
                        return 'edit';
                    },
                    regional: function () {
                        return vm.regional;
                    },
                    event: function () {
                        return event;
                    }
                }
            });

            modalCalendarEditEvent.result.then(function () {
                CalendarService.getCalendar().then(function (res) {
                    vm.calendar = res.data;
                });
            });
        };

        vm.removeEvent = function (id, description) {
            vm.confirmationModal('md', 'Você deseja excluir o evento ' + description + '?');
            removeConfirmationModal
                .result
                .then(function () {
                    CalendarService
                        .removeCalendar(id)
                        .then(function () {
                            vm.dtInstance.DataTable.draw();
                            NotificationService.success('Evento removido com sucesso.');
                        });
                });
        };

        function _ModalEditEventCtrl(
            $scope,
            $http,
            $log,
            $uibModalInstance,
            PermissionService,
            regional,
            event,
            type
        ) {
            var vm = $scope;
            $log.info('ModalEditEventCtrl');

            vm.type = type;

            if (_view) {
                vm.canPermission = false;
                _view = false;
            } else {
                vm.canPermission = PermissionService.canPut('calendar');
            }

            var new_init_date = CalendarService.convertDate(event.init_date);
            var new_end_date = CalendarService.convertDate(event.end_date);

            vm.regional = regional;
            vm.newRegister = {};
            vm.newRegister.id = event.id;
            vm.newRegister.regional = event.regional.length === 2 ? '0' : String(event.regional[0].id);
            vm.newRegister.description = event.description;
            vm.newRegister.init_date = event.init_date ? CalendarService.dateToStr(new_init_date) : '';
            vm.newRegister.end_date = event.end_date ? CalendarService.dateToStr(new_end_date) : '';
            vm.newRegister.highlight = event.highlight;

            vm.ok = function () {
                var newRegional = [];

                if (vm.newRegister.regional === '0') {
                    angular.forEach(regional, function (v, k) {
                        newRegional.push(regional[k].id);
                    });

                    vm.newRegister.regional = newRegional;
                }
                vm.isLoading = true;

                CalendarService.updateCalendar(vm.newRegister).then(function (data) {
                    if (data.status === '200') {
                        NotificationService.success('Evento atualizado com sucesso.');
                        vm.dtInstance.DataTable.draw();
                    }
                    $uibModalInstance.close();
                })
                .catch(function (){console.error})
                .then(function() { vm.isLoading = false; });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            vm.canSave = function() {
                return _canSaveCalendar(vm.newRegister);
            }
        }

        function _ModalCalendarSchoolDaysCtrl($scope, $http, $uibModalInstance, schoolDays, regional, validationService) {
            $log.info('ModalCalendarSchoolDaysCtrl');
            var vm = $scope;

            vm.time_months = DateTimeHelper.getMonths(true);
            vm.time_years = DateTimeHelper.yearRange();
            vm.regional = regional;
            vm.schoolDays = schoolDays;
            vm.months = [];

            angular.forEach(vm.schoolDays.items, function (data) {
                vm.months.push(data.period);
            });

            vm.months = _.uniq(vm.months); // jshint ignore: line

            vm.convertPeriodStr = function (date) {
                return CalendarService.convertPeriodStr(date);
            };

            vm.period = {
                id: '',
                month: '',
                year: '',
                regional: '',
                school_days: '',
                school_saturdays: ''
            };

            vm.periodUpdate = function (month, year, regional_id) {
                if (month && year && regional_id) {
                    var filtered_month = _.filter(vm.schoolDays.items, function (b) { // jshint ignore: line
                        if (b.month === month && b.year === year && b.regional.id === parseInt(regional_id)) {
                            return b;
                        }
                    });

                    $timeout(function () {
                        if (filtered_month[0]) {
                            vm.hasPeriod = true;
                            vm.period.school_days = filtered_month[0].school_days;
                            vm.period.school_saturdays = filtered_month[0].school_saturdays;
                            vm.period.id = filtered_month[0].id;
                        } else {
                            vm.hasPeriod = false;
                            vm.period.school_days = '';
                            vm.period.school_saturdays = '';
                        }
                    });
                }
            };

            vm.ok = function () {
                if (!validationService.isValid(vm.formDays.$invalid)) {
                    return false;
                }
                vm.isLoading = true;

                if (vm.hasPeriod === true) {
                    CalendarService.updatePeriod(vm.period).then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(console.error)
                    .then(function() { vm.isLoading = false; });
                } else {
                    CalendarService.newPeriod(vm.period).then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(console.error)
                    .then(function() { vm.isLoading = false; });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        function _ModalCalendarioNovoCtrl(
            $scope,
            $uibModalInstance,
            regional,
            $log,
            PermissionService,
            type,
            $route,
            validationService) {
            $log.info('ModalCalendarioNovoCtrl');
            var vm = $scope;

            if (_view) {
                vm.canPermission = false;
                _view = false;
            } else {
                vm.canPermission = PermissionService.canPost('calendar');
            }
            vm.type = type;
            vm.regional = regional;
            vm.newRegister = {
                description: '',
                init_date: '',
                end_date: '',
                highlight: false
            };

            vm.ok = function () {
                if (!validationService.isValid(vm.formCalendar.$invalid)) {
                    return false;
                }

                var newRegional = [];

                if (vm.newRegister.regional === '0') {
                    angular.forEach(regional, function (v, k) {
                        newRegional.push(regional[k].id);
                    });

                    vm.newRegister.regional = newRegional;
                }
                vm.isLoading = true;

                CalendarService.postCalendar(vm.newRegister).then(function () {
                    $route.reload();
                    $uibModalInstance.close();
                })
                .catch(console.error)
                .then(function() { vm.isLoading = false; });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            vm.canSave = function() {
                return _canSaveCalendar(vm.newRegister);
            }
        }

        function _canSaveCalendar(newRegister) {
            return newRegister.regional && newRegister.description 
                && newRegister.init_date && newRegister.end_date;
        }

        function _permissions() {
            _canDelete();
            _canPost();
            _canPut();

        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('calendar');
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('calendar');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('calendar');
        }
    }
})();
