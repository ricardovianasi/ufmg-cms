(function () {
    'use strict';

    angular.module('componentsModule')
        .directive('publishmentOptions', PublishmentOptions);

    /** ngInject */
    function PublishmentOptions($location, $filter, validationService, StatusService, $log, DateTimeHelper) {
        return {
            restrict: 'E',
            templateUrl: 'components/publishment/publishment.template.html',
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
                $window.history.back();
            };
        }

        function linkController($scope, element, attrs) {
            $log.info('PublishmentDirective');
            var vm = $scope;
            var preSaveStatus = StatusService.STATUS_DRAFT;
            var nowDate;
            var dateChoice;
            vm.vm = $scope;
            vm.statuses = [];
            vm.obj.scheduled_date = undefined;
            vm.obj.scheduled_time = undefined;
            vm.immediately = true;
            vm.obj.status = StatusService.STATUS_DRAFT;

            vm.obj = vm.$parent.$eval(attrs.routeModel);
            vm.publish = _publish;
            vm.remove = vm.$parent.remove;
            // vm.back = vm.$parent.back || _back;
            vm.publisher = vm.$parent.publish || vm.publishMethod;

            vm.saveDraft = _saveDraft;
            vm.status = _status;
            vm.publishEdit = _publishEdit;
            vm.cancelSelectDate = _cancelSelectDate;
            vm.datePost = datePost;
            vm.clearFildHour = _clearFildHour;
            vm.preview = _preview;

            onInit();

            function onInit() {
                vm.$watch('vm.obj.scheduled_time', function () {
                    if (vm.obj.scheduled_time === '' && vm.todayDiferentHour) {
                        vm.todayDiferentHour = false;
                        vm.immediately = true;
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

                StatusService
                    .getStatus()
                    .then(function (data) {
                        vm.statuses = data.data;
                    });
            }

            function _clearFildHour(event) {
                event.target.value = '';
            }

            function _saveDraft($event) {
                $event.stopPropagation();
                vm.obj.status = StatusService.STATUS_DRAFT;
                vm.obj.saveDraftClicked = true;
                vm.publisher(vm.obj);
            }

            function _status(status) {
                $log.info('Status: ', status);
                if (status !== StatusService.STATUS_PUBLISHED) {
                    if (!vm.isScheduled && status === StatusService.STATUS_SCHEDULED) {
                        vm.obj.status = StatusService.STATUS_PUBLISHED;
                        vm.obj.scheduled_date = '';
                        vm.obj.scheduled_time = '';
                    } else if (vm.isScheduled) {
                        vm.obj.status = StatusService.STATUS_SCHEDULED;
                    } else {
                        vm.obj.status = status;
                    }
                    $log.info('objeto status: ', vm.obj.status);
                } else {
                    if (vm.obj.scheduled_date === '' && vm.obj.scheduled_time === '') {
                        vm.obj.status = StatusService.STATUS_PUBLISHED;
                    } else {
                        vm.obj.scheduled_date = '';
                        vm.obj.scheduled_time = '';
                        vm.obj.status = StatusService.STATUS_PUBLISHED;
                    }
                }
                $log.info('objeto status salvo: ', vm.obj.status);
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
                vm.obj.status = StatusService.STATUS_DRAFT;
                vm.publisher(vm.obj, true);
            }

            function _publish() {
                if (!validationService.isValid(vm.$parent.formData.$invalid)) {
                    return false;
                }
                if (preSaveStatus === StatusService.STATUS_DRAFT) {
                    vm.obj.status = StatusService.STATUS_PUBLISHED;
                } else {
                    vm.obj.status = preSaveStatus;
                }
                vm.publisher(vm.obj);
            }

            function datePostValidateHour(isHour) {
                var isValidHour = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(vm.obj.scheduled_time);
                if (!isValidHour && !!vm.obj.scheduled_time) {
                    vm.errorInvalid = true;
                    return true;
                }
                if (isHour && !vm.obj.scheduled_time) {
                    return true;
                }
                vm.errorInvalid = false;
                return false;
            }

            function datePostImmediately() {
                if (!vm.obj.scheduled_date) {
                    vm.immediately = true;
                    preSaveStatus = StatusService.STATUS_PUBLISHED;
                    vm.obj.scheduled_date = '';
                    vm.obj.scheduled_time = '';
                    return true;
                }
                return false;
            }

            function datePostTodayDiferentHour() {
                nowDate = new Date();
                dateChoice = new Date(vm.obj.scheduled_date);
                if (dateChoice.toDateString() === nowDate.toDateString()) {
                    if (vm.obj.scheduled_time) {
                        vm.todayDiferentHour = true;
                        var hh = Number(vm.obj.scheduled_time.split(':')[0]);
                        var mm = Number(vm.obj.scheduled_time.split(':')[1]);
                        var isHourRetro = hh < dateChoice.getHours();
                        var isHourEqualRetro = hh === dateChoice.getHours();
                        var isMinutesRetro = mm < dateChoice.getMinutes();
                        var isRetro = isHourRetro || (isHourEqualRetro && isMinutesRetro);
                        if (isRetro) {
                            vm.retroactive = true;
                            preSaveStatus = StatusService.STATUS_DRAFT;
                        } else {
                            preSaveStatus = StatusService.STATUS_PUBLISHED;
                        }
                    } else {
                        vm.immediately = true;
                    }
                    return true;
                }
                return false;
            }

            function datePostRetroactive() {
                if (dateChoice.valueOf() < nowDate.valueOf()) {
                    vm.retroactive = true;
                    preSaveStatus = StatusService.STATUS_DRAFT;
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

            function datePostTomorrow() {
                var tommorowDate = new Date();
                tommorowDate.setDate(tommorowDate.getDate() + 1);
                if (tommorowDate.toDateString() === dateChoice.toDateString()) {
                    if (!vm.obj.scheduled_time) {
                        vm.obj.scheduled_time = '08:00';
                    }
                    vm.tomorrow = true;
                    preSaveStatus = StatusService.STATUS_PUBLISHED;
                    return true;
                }
                return false;
            }

            function datePostScheduled() {
                vm.scheduled = true;
                if (!vm.obj.scheduled_time) {
                    vm.obj.scheduled_time = '08:00';
                }
                preSaveStatus = StatusService.STATUS_PUBLISHED;
            }

            function datePost(isHour) {
                if (datePostValidateHour(isHour)) {
                    return;
                }
                vm.obj.status = StatusService.STATUS_DRAFT;
                vm.retroactive = false;
                vm.immediately = false;
                vm.todayDiferentHour = false;
                vm.tomorrow = false;
                vm.scheduled = false;
                if (datePostImmediately()) {
                    return;
                }
                if (datePostTodayDiferentHour()) {
                    return;
                }
                if (datePostTomorrow()) {
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
