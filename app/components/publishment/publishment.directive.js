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
        $timeout
    ) {
        return {
            restrict: 'E',
            templateUrl: 'components/publishment/publishment.template.1.html',
            scope: {
                obj: '=routeModel',
                publishMethod: '=?publishMethod'
            },
            link: linkController,
            controller: PublishmentController
        };

        /** ngInject */
        function PublishmentController($scope, $window) {
            $scope.back = function () {
                $scope.showLoad = false;
                $window.history.back();
            };
        }

        function linkController($scope, element, attrs) {
            $log.info('PublishmentDirective');
            var vm = $scope;
            var nowDate;
            var dateChoice;
            vm.vm = $scope;
            vm.obj.scheduled_date = '';
            vm.obj.scheduled_time = '';
            vm.obj.status = '';
            vm.preSaveStatus = '';

            vm.obj = vm.$parent.$eval(attrs.routeModel);
            vm.publish = _publish;
            vm.remove = vm.$parent.remove;
            // vm.back = vm.$parent.back || _back;
            vm.publisher = vm.$parent.publish || vm.publishMethod;

            vm.publishEdit = _publishEdit;
            vm.cancelSelectDate = _cancelSelectDate;
            vm.datePost = datePost;
            vm.datePostValidateHour = datePostValidateHour;
            vm.clearFildHour = _clearFildHour;
            vm.preview = _preview;
            vm.isDateValid = function () {
                if (!vm.obj.scheduled_date) {
                    vm.errorInvalidDate = true;
                } else {
                    vm.errorInvalidDate = false;
                }
            }

            onInit();

            function onInit() {
                $timeout(function () {
                    vm.showLoad = true;
                    vm.preSaveStatus = vm.obj.status ? vm.obj.status : '';
                }, 500);

                vm.$watch('vm.preSaveStatus', function () {
                    vm.errorInvalidStatus = false;
                    if (vm.preSaveStatus === 'scheduled' && !vm.obj.id) {
                        vm.showMessage = true;
                        vm.messageText = 'As publicações agendadas precisam ser compartilhadas entre 10 minutos e 6 meses após a criação delas.'
                    } else if (vm.preSaveStatus === 'scheduled' && vm.obj.status === 'published' && vm.obj.id) {
                        vm.showMessage = true;
                        vm.messageText = 'Está publicação já está publicada.';
                    } else {
                        vm.showMessage = false;
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
                    initDate: DateTimeHelper.getDatepickerOpt()
                };

                vm.datepickerOpt.initDate.status = {
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

            function _cancelSelectDate() {
                vm.selectDate = !vm.selectDate;
            }

            function _preview() {
                vm.publisher(vm.obj, true);
            }

            function _publish(isValid) {
                if (!vm.preSaveStatus) {
                    vm.$parent.formData.$invalid = true;
                    vm.errorInvalidStatus = true;
                }
                if (!validationService.isValid(vm.$parent.formData.$invalid)) {
                    return false;
                }
                vm.obj.status = vm.preSaveStatus;
                vm.publisher(vm.obj);
            }

            function datePostValidateHour() {
                var isValidHour = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(vm.obj.scheduled_time);
                if (!isValidHour && !!vm.obj.scheduled_time) {
                    vm.errorInvalidHour = true;
                    return true;
                }
                if (!vm.obj.scheduled_time) {
                    return true;
                }
                vm.errorInvalidHour = false;
                return false;
            }

            function datePostRetroactive() {
                if (dateChoice.valueOf() < nowDate.valueOf()) {
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
                    return true;
                }
                return false;
            }

            function datePostScheduled() {
                if (!vm.obj.scheduled_time) {
                    vm.obj.scheduled_time = '08:00';
                }
                // vm.obj.status = StatusService.STATUS_SCHEDULED;
                return true;
            }

            function datePostToday() {
                nowDate = new Date();
                dateChoice = new Date(vm.obj.scheduled_date);
                if (dateChoice.toDateString() === nowDate.toDateString()) {
                    if (!vm.obj.scheduled_time) {
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
                    // vm.obj.status = StatusService.STATUS_DRAFT;
                    return true;
                }
                return false;
            }

            function datePost() {
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
