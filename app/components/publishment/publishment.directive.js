(function () {
    'use strict';

    angular.module('componentsModule')
        .directive('publishmentOptions', PublishmentOptions);

    /** ngInject */
    function PublishmentOptions(
        $location,
        $filter,
        validationService,
        StatusService,
        $log,
        DateTimeHelper,
        PermissionService,
        $rootScope,
        $timeout
    ) {
        return {
            restrict: 'E',
            templateUrl: 'components/publishment/publishment.template.1.html',
            scope: {
                obj: '=routeModel',
                publishMethod: '=?publishMethod'
            },
            link: linkController
        };

        function linkController($scope, element, attrs) {
            $log.info('PublishmentDirective');
            var vm = $scope;
            var nowDate;
            var dateChoice;
            var dateCurrent;
            vm.vm = $scope;
            vm.obj.scheduled_date = '';
            vm.obj.scheduled_time = '';
            vm.obj.status = '';
            vm.preSaveStatus = '';
            vm.showMessageWarn = false;
            vm.showMessageError = false;

            vm.obj = vm.$parent.$eval(attrs.routeModel);
            vm.remove = vm.$parent.remove;
            vm.publisher = vm.$parent.publish || vm.publishMethod;

            vm.publish = _publish;
            vm.publishEdit = _publishEdit;
            vm.cancelSelectDate = _cancelSelectDate;
            vm.datePost = datePost;
            vm.datePostValidateHour = datePostValidateHour;
            vm.clearFildHour = _clearFildHour;
            vm.preview = _preview;
            vm.back = function () {
                var forceBreak = false;
                var url = '#' + $location.url().split('/').reduce(function (accumulator, currentValue) {
                    if (currentValue === 'new' || currentValue === 'edit') {
                        forceBreak = true;
                    }
                    if (forceBreak) {
                        return accumulator;
                    }
                    return accumulator += '/' + currentValue;
                });
                return url;
            };
            vm.new = function () {
                var forceBreak = false;
                var url = '#' + $location.url().split('/').reduce(function (accumulator, currentValue) {
                    if (currentValue === 'new' || currentValue === 'edit') {
                        forceBreak = true;
                    }
                    if (forceBreak) {
                        return accumulator;
                    }
                    return accumulator += '/' + currentValue;
                }) + '/new';
                return url;
            };
            vm.isDateValid = function () {
                if (!vm.obj.scheduled_date) {
                    vm.errorInvalidDate = true;
                } else {
                    vm.errorInvalidDate = false;
                }
            };

            onInit();

            function onInit() {
                $timeout(function () {
                    vm.showLoad = true;
                    dateChoice = new Date(vm.obj.scheduled_date);
                    vm.preSaveStatus = vm.obj.status ? vm.obj.status : '';
                    dateCurrent = new Date(vm.obj.scheduled_date);
                    vm.canDelete = PermissionService.canDelete($rootScope.moduleCurrent, vm.obj.id);
                    vm.canPost = PermissionService.canPost($rootScope.moduleCurrent, vm.obj.id);
                    vm.preSaveStatus = vm.obj.id ? vm.obj.status : 'draft';
                }, 500);

                vm.$watch('vm.preSaveStatus', function () {
                    vm.errorInvalidStatus = false;
                    vm.datepickerOpt.initDatea.dateOptions.minDate = null;
                    vm.datepickerOpt.initDatea.dateOptions.maxDate = null;
                    vm.isScheduledRetroactive = false;
                    if (vm.preSaveStatus === 'scheduled' && !vm.obj.id) {
                        vm.datepickerOpt.initDatea.dateOptions.minDate = new Date();
                        vm.showMessageWarn = true;
                        vm.messageText = 'As publicações agendadas precisam ser compartilhadas' +
                            'entre 10 minutos e 6 meses após a criação delas.';
                        if (verifyHourFuture()) {
                            vm.obj.post_date = '';
                            vm.obj.scheduled_time = '';
                        }
                    } else if (vm.preSaveStatus === 'scheduled' && vm.obj.status === 'published' && vm.obj.id) {
                        vm.showMessageError = true;
                        vm.messageText = 'Está publicação já está publicada.';
                        vm.isScheduledRetroactive = true;
                    } else if (vm.preSaveStatus === 'scheduled' && vm.obj.id && vm.obj.status !== 'published') {
                        vm.datepickerOpt.initDatea.dateOptions.minDate = new Date();
                        if (verifyHourFuture() && !vm.showLoad) {
                            vm.showMessageError = true;
                            vm.messageText = 'São permitidas apenas datas futuras.';
                        }
                    } else if (vm.preSaveStatus === 'published' && vm.obj.id) {
                        vm.showMessageError = false;
                        var yesterdayDate = new Date();
                        yesterdayDate.setDate(yesterdayDate.getDate());
                        vm.datepickerOpt.initDatea.dateOptions.maxDate = yesterdayDate;
                        if (vm.obj.status === 'published' && dateChoice.valueOf() > yesterdayDate.valueOf()) {
                            vm.showMessageError = true;
                            vm.messageText = 'Este já está publicado, datas futuras não são válidas. Altere a data.';
                        } else if (vm.obj.status === 'scheduled' && dateChoice.valueOf() > yesterdayDate.valueOf()) {
                            vm.showMessageError = true;
                            vm.messageText = 'Este está agendado, altere a data para publicação';
                            vm.obj.post_date = '';
                            vm.obj.scheduled_time = '';
                        }
                    } else if (vm.preSaveStatus === 'published' && !vm.obj.id && vm.obj.post_date) {
                        if (!verifyHourFuture()) {
                            datePostScheduled();
                        }
                        datePost();
                    } else {
                        vm.showMessageError = false;
                        vm.showMessageWarn = false;
                        vm.obj.scheduled_date = new Date();
                        var hh = vm.obj.scheduled_date.getHours();
                        var MM = vm.obj.scheduled_date.getMinutes();
                        if (hh < 10) {
                            hh = '0' + hh;
                        }
                        if (MM < 10) {
                            MM = '0' + MM;
                        }
                        vm.obj.scheduled_time = hh + ':' + MM;
                    }
                });

                vm.$watch('vm.obj.post_date', function () {
                    if (vm.obj.scheduled_date) {
                        var date = new Date(vm.obj.post_date);
                        vm.obj.scheduled_date = date;
                        var hh = date.getHours();
                        var MM = date.getMinutes();
                        if (hh < 10) {
                            hh = '0' + hh;
                        }
                        if (MM < 10) {
                            MM = '0' + MM;
                        }
                        vm.obj.scheduled_time = hh + ':' + MM;
                        vm.immediately = false;
                    }

                    if (vm.obj.publish_date) {
                        var publishDate = new Date(vm.obj.publish_date);
                        vm.obj.publish_date = publishDate;
                    }
                });

                vm.datepickerOpt = {
                    initDatea: DateTimeHelper.getDatepickerOpt()
                };

                vm.datepickerOpt.initDatea.status = {
                    opened: false
                };

                vm.timepickerOpt = {
                    initTime: DateTimeHelper.getTimepickerOpt()
                };
            }

            function _clearFildHour(event) {
                event.target.value = '';
            }

            function _publishEdit() {
                vm.selectDate = !vm.selectDate;
                if (!vm.obj.scheduled_date) {
                    vm.obj.scheduled_date = new Date();
                }
            }

            function verifyHourFuture() {
                if (!isDateFuture()) {
                    return true;
                }
                var dateNow = new Date();
                var hh = dateNow.getHours();
                var MM = dateNow.getMinutes();
                var hhScheduled = parseInt(vm.obj.scheduled_time.split(':')[0]);
                var mmScheduled = parseInt(vm.obj.scheduled_time.split(':')[1]);
                if (hh > hhScheduled && !vm.showLoad) {
                    vm.obj.scheduled_time = '';
                    return false;
                } else if (vm.preSaveStatus === 'published') {
                    return false;
                } else if (hh <= hhScheduled && MM > mmScheduled && !vm.showLoad) {
                    vm.obj.scheduled_time = '';
                    return false;
                }
                return true;
            }

            function _cancelSelectDate() {
                vm.selectDate = !vm.selectDate;
            }

            function _preview() {
                vm.publisher(vm.obj, true);
            }

            function _publish(formPub) {
                if (formPub.$error['dateDisabled']) {
                    var count = 0;
                    var hasDateDisabled = false;
                    for (var key in formPub.$error) {
                        if (key === 'dateDisabled') {
                            delete formPub.$error['dateDisabled'];
                            hasDateDisabled = true;
                        }
                        count = +1;
                    }
                    if (count === 1 && hasDateDisabled) {
                        formPub.$invalid = false;
                    }
                }
                var isInvalid = formPub.$invalid;
                if (vm.errorInvalidHour || vm.errorInvalidDate) {
                    validationService.isValid(true);
                    return false;
                }
                if (!validationService.isValid(isInvalid)) {
                    return false;
                }
                if (!validationService.isValid(vm.$parent.formData.$invalid)) {
                    return false;
                }
                vm.obj.status = vm.preSaveStatus === 'scheduled' ? 'published' : vm.preSaveStatus;
                vm.publisher(vm.obj);
            }

            function datePostValidateHour() {
                var isValidHour = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(vm.obj.scheduled_time);
                if (!isValidHour && !!vm.obj.scheduled_time) {
                    vm.errorInvalidHour = true;
                    return true;
                } else if (!vm.obj.scheduled_time) {
                    return true;
                } else if (vm.preSaveStatus === 'scheduled' && !isDateFuture()) {
                    if (verifyHourFuture()) {
                        vm.showMessageError = true;
                        vm.messageText = 'A hora deve ser maior que a hora atual';
                    } else {
                        vm.showMessageError = false;
                    }
                } else if (vm.preSaveStatus === 'published' && isDateFuture()) {
                    if (verifyHourFuture()) {
                        vm.showMessageWarn = false;
                    } else {
                        vm.showMessageWarn = true;
                        vm.messageText = 'Data futura. Esta publicação será agendada.';
                    }
                } else {
                    vm.showMessageWarn = false;
                    vm.showMessageError = false;
                    vm.errorInvalidHour = false;
                }
                return false;
            }

            function isDateFuture() {
                dateChoice = new Date(vm.obj.scheduled_date);
                var dateNow = new Date();
                if (vm.obj.scheduled_time) {
                    dateChoice.setHours(Number(vm.obj.scheduled_time.split(':')[0]));
                    dateChoice.setMinutes(Number(vm.obj.scheduled_time.split(':')[1]));
                }
                if (dateChoice.valueOf() > dateNow.valueOf()) {
                    return true;
                }
                return false;
            }

            function datePostRetroactive() {
                if (dateCurrent.toDateString() === 'Invalid Date') {
                    dateCurrent = new Date();
                }
                if (dateChoice.valueOf() < dateCurrent.valueOf()) {
                    vm.retroactive = true;
                    var datePost = new Date(vm.obj.scheduled_date);
                    if (vm.obj.scheduled_time) {
                        datePost.setHours(Number(vm.obj.scheduled_time.split(':')[0]));
                        datePost.setMinutes(Number(vm.obj.scheduled_time.split(':')[1]));
                    } else {
                        vm.obj.scheduled_time = '08:00';
                        datePost.setHours(8);
                        datePost.setMinutes(0);
                    }
                    datePost.setSeconds(0);
                    datePost.setMilliseconds(0);
                    vm.obj.post_date = datePost.toISOString();
                    if (!vm.obj.id && vm.preSaveStatus === 'published') {
                        vm.showMessageWarn = true;
                        vm.messageText = 'Esta publicação será publicada com data retrocedida.';
                    } else if (vm.preSaveStatus === 'published') {
                        vm.showMessageWarn = true;
                        vm.messageText = 'Publicação retrocedida.';
                    }
                    return true;
                }
                return false;
            }

            function datePostScheduled() {
                if (!vm.obj.scheduled_time) {
                    vm.obj.scheduled_time = '08:00';
                }
                if (!vm.preSaveStatus) {
                    vm.showMessageWarn = true;
                    vm.messageText = 'Status alterado para Agendado.';
                    vm.preSaveStatus = 'scheduled';
                }
                if (vm.preSaveStatus && vm.preSaveStatus === 'published') {
                    vm.showMessageWarn = true;
                    vm.messageText = 'Data futura. Esta publicação será agendada.';
                }
                // vm.obj.status = StatusService.STATUS_SCHEDULED;
                return true;
            }

            function datePostToday() {
                nowDate = new Date();
                dateChoice = new Date(vm.obj.scheduled_date);
                if (dateChoice.toDateString() === nowDate.toDateString()) {
                    if (!vm.obj.scheduled_time || vm.obj.scheduled_time === 'NaN:NaN') {
                        var date = new Date();
                        var hh = date.getHours();
                        var MM = date.getMinutes();
                        if (hh < 10) {
                            hh = '0' + hh;
                        }
                        if (MM < 10) {
                            MM = '0' + MM;
                        }
                        vm.obj.scheduled_time = hh + ':' + MM;
                    }
                    datePostValidateHour();
                    // vm.obj.status = StatusService.STATUS_DRAFT;
                    return true;
                }
                return false;
            }

            function datePost() {
                if (!vm.obj.id && vm.preSaveStatus === 'scheduled') {
                    vm.showMessageError = false;
                } else {
                    vm.showMessageError = false;
                    vm.showMessageWarn = false;
                }
                if (datePostToday()) {
                    return;
                }
                if (datePostRetroactive()) {
                    return;
                }
                if (datePostScheduled()) {
                    return;
                }
                return true;
            }
        }
    }
})();
