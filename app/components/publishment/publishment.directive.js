(function () {
    'use strict';

    angular.module('componentsModule')
        .directive('publishmentOptions', PublishmentOptions);

    /** ngInject */
    function PublishmentOptions( $log, $location, $filter, $q, validationService, StatusService, DateTimeHelper,
        PermissionService, $rootScope, $timeout, ModalService) {

        return {
            restrict: 'E',
            templateUrl: 'components/publishment/publishment.template.1.html',
            scope: {
                obj: '=routeModel',
                isLoading: '=?isLoading',
                publishMethod: '=?publishMethod',
                isSuperPut: '='
            },
            link: linkController
        };

        function linkController($scope, element, attrs) {
            var vm = $scope;
            var nowDate;
            var dateChoice;
            var dateCurrent;
            let FORMAT_DATE = "YYYY-MM-DD[T]HH:mm:ss";
            vm.vm = $scope;
            vm.obj.scheduled_date = '';
            vm.obj.scheduled_time = '';
            vm.obj.status = '';
            vm.preSaveStatus = '';
            vm.showMessageWarn = false;
            vm.showMessageError = false;

            vm.obj = vm.$parent.$eval(attrs.routeModel);
            vm.remove = vm.$parent.remove;
            vm.publisher = vm.publishMethod || vm.$parent.publish;

            vm.publish = _publish;
            vm.publishEdit = _publishEdit;
            vm.cancelSelectDate = _cancelSelectDate;
            vm.datePost = datePost;
            vm.datePostValidateHour = datePostValidateHour;
            vm.clearFildHour = _clearFildHour;
            vm.preview = _preview;

            onInit();

            function isPublished(value) {
                return value === 'published';
            }

            function isScheduled(value) {
                return value === 'scheduled';
            }

            function onInit() {
                vm.statusLabel = {
                    draft: 'Não Publicado',
                    published: 'Publicado',
                    scheduled: 'Agendado'
                };
                $timeout(function () {
                    _initDirective();
                }, 600);
                _initListenerObjLoaded();
                _initListenerChangeStatus();
                _initListenerChangePostDate();
                _initDateTimePickerOptions();
            }

            function _initDateTimePickerOptions() {
                vm.datepickerOpt = {
                    initDatea: DateTimeHelper.getDatepickerOpt()
                };
                vm.timepickerOpt = {
                    initTime: DateTimeHelper.getTimepickerOpt()
                };
            }

            function _initListenerObjLoaded() {
                vm.$on('objPublishLoaded', function() {
                    _initDirective();
                });
            }

            function _initDirective() {
                vm.showLoad = true;
                vm.preSaveStatus = vm.obj.status ? vm.obj.status : '';
                vm.preSaveStatus = vm.obj.id ? vm.obj.status : 'draft';
                dateChoice = _convertToDate(vm.obj.scheduled_date);
                dateCurrent = moment(vm.obj.scheduled_date, FORMAT_DATE).toDate();
                vm.moduleCurrent = $rootScope.moduleCurrent;
                vm.canDelete = PermissionService.canDelete($rootScope.moduleCurrent, vm.obj.id);
                vm.canPost = PermissionService.canPost($rootScope.moduleCurrent, vm.obj.id);
            }

            function _initListenerChangeStatus() {
                vm.$watch('vm.preSaveStatus', function () {

                    let isEdit = angular.isDefined(vm.obj.id);
                    let isChangePublished = isPublished(vm.preSaveStatus);
                    let isChangeScheduled = isScheduled(vm.preSaveStatus);
                    let isPublishedObj = isPublished(vm.obj.status);
                    let isScheduledObj = isScheduled(vm.obj.status);

                    vm.errorInvalidStatus = false;
                    vm.datepickerOpt.initDatea.dateOptions.minDate = null;
                    vm.datepickerOpt.initDatea.dateOptions.maxDate = null;
                    vm.isScheduledRetroactive = false;
                    if (isChangeScheduled && !isEdit) {
                        vm.datepickerOpt.initDatea.dateOptions.minDate = new Date();
                        vm.showMessageWarn = true;
                        vm.messageText = 'As publicações agendadas precisam ser compartilhadas ' +
                            'entre 10 minutos e 6 meses após a criação delas.';
                        if (verifyHourFuture()) {
                            vm.obj.post_date = '';
                            vm.obj.scheduled_time = '';
                        }
                    } else if (isChangeScheduled && !isPublishedObj && isEdit) {
                        vm.datepickerOpt.initDatea.dateOptions.minDate = new Date();
                        if (verifyHourFuture() && !vm.showLoad) {
                            vm.showMessageError = true;
                            vm.messageText = 'São permitidas apenas datas futuras.';
                        }
                    } else if (isChangePublished && isEdit) {
                        vm.showMessageError = false;
                        let yesterdayDate = new Date();
                        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                        let isDateChoiceFuture = dateChoice.valueOf() > yesterdayDate.valueOf();
                        vm.datepickerOpt.initDatea.dateOptions.maxDate = new Date();
                        // if (isPublishedObj && isDateChoiceFuture) {
                        //     vm.showMessageError = true;
                        //     vm.messageText = 'Já está publicado, datas futuras não são válidas. Altere a data.';
                        // } else
                        if (isScheduledObj && isDateChoiceFuture) {
                            vm.showMessageError = true;
                            vm.messageText = 'Já está agendado, altere a data para publicação';
                            vm.obj.post_date = '';
                            vm.obj.scheduled_time = '';
                        }
                    } else if (isChangePublished && !isEdit && vm.obj.post_date) {
                        if (!verifyHourFuture()) {
                            datePostScheduled();
                        }
                        datePost();
                    } else if(!isEdit) {
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
                    } else {
                        vm.showMessageError = false;
                        vm.showMessageWarn = false;
                    }
                });
            }

            function _initListenerChangePostDate() {
                vm.$watch('vm.obj.post_date', function () {
                    console.log('$watch', vm.obj.post_date);
                    if (vm.obj.scheduled_date) {
                        let date = moment(vm.obj.post_date, FORMAT_DATE).toDate();
                        vm.obj.scheduled_date = date;
                        let hh = date.getHours();
                        let MM = date.getMinutes();
                        if (hh < 10) {
                            hh = '0' + hh;
                        }
                        if (MM < 10) {
                            MM = '0' + MM;
                        }
                        vm.obj.scheduled_time = hh + ':' + MM;
                    }

                    if (vm.obj.publish_date) {
                        let publishDate = moment(vm.obj.publish_date, FORMAT_DATE).toDate();
                        vm.obj.publish_date = publishDate;
                    }
                });
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
                } else if (isPublished(vm.preSaveStatus)) {
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

            function _verifyChangeStatus() {
                if(vm.preSaveStatus !== vm.obj.status && vm.obj.id) {
                    let textConfirm = 'Atenção, o status de publicação foi alterado para <b class="text-danger">' +
                        vm.statusLabel[vm.preSaveStatus] + '</b>. Deseja prosseguir?';
                    return ModalService.confirm(textConfirm, ModalService.MODAL_MEDIUM, { isDanger: true }).result;
                }
                let defer = $q.defer();
                defer.resolve();
                return defer.promise;
            }

            function _validateDate(formPub) {
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
            }

            function _validate(formPub) {
                _validateDate(formPub);
                var isInvalid = formPub.$invalid;

                if (formPub.initDatea && (formPub.initDatea.$error.validTime || formPub.initDatea.$error.validDate)) {
                    validationService.isValid(true);
                    return false;
                }
                if (!validationService.isValid(isInvalid)) {
                    return false;
                }
                if (!validationService.isValid(vm.$parent.formData.$invalid)) {
                    return false;
                }
                return true;
            }

            function _publish(formPub) {
                if(_validate(formPub)) {
                    _verifyChangeStatus().then(function() {
                        vm.obj.status = vm.preSaveStatus === 'scheduled' ? 'published' : vm.preSaveStatus;
                        vm.publisher(vm.obj);
                    }).catch(function() {});
                }
            }

            function datePostValidateHour() {
                if (!vm.obj.scheduled_time) {
                    return true;
                } else if (isScheduled(vm.preSaveStatus) && !isDateFuture()) {
                    if (verifyHourFuture()) {
                        vm.showMessageError = true;
                        vm.messageText = 'A hora deve ser maior que a hora atual';
                    } else {
                        vm.showMessageError = false;
                    }
                } else if (isPublished(vm.preSaveStatus) && isDateFuture()) {
                    if (verifyHourFuture()) {
                        vm.showMessageWarn = false;
                    } else {
                        vm.showMessageWarn = true;
                        vm.messageText = 'Data futura. Esta publicação será agendada.';
                    }
                } else {
                    vm.showMessageWarn = false;
                    vm.showMessageError = false;
                }
                return false;
            }

            function isDateFuture() {
                dateChoice = _convertToDate(vm.obj.scheduled_date);
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
                    var datePost = moment(vm.obj.scheduled_date).toDate();
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
                    console.log('datePostRetroactive', datePost, vm.obj.scheduled_date);
                    vm.obj.post_date = datePost.toISOString();
                    if (!vm.obj.id && isPublished(vm.preSaveStatus)) {
                        vm.showMessageWarn = true;
                        vm.messageText = 'Esta pagina será publicada com data retrocedida.';
                    } else if (isPublished(vm.preSaveStatus)) {
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
                if (isPublished(vm.preSaveStatus)) {
                    vm.showMessageWarn = true;
                    vm.messageText = 'Data futura. Esta publicação será agendada.';
                }
                // vm.obj.status = StatusService.STATUS_SCHEDULED;
                return true;
            }

            function datePostToday() {
                nowDate = new Date();
                dateChoice = _convertToDate(vm.obj.scheduled_date);
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
                if (!vm.obj.id && isScheduled(vm.preSaveStatus)) {
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

            function _convertToDate(dateStr) {
                dateStr = String(dateStr);
                let dateConverted;
                if(!dateStr || dateStr.indexOf('/') === -1) {
                    dateConverted = new Date(dateStr);
                } else {
                    let dateStrToConvert = dateStr.split('/').reverse().join('/');
                    dateConverted = new Date(dateStrToConvert);
                }
                return dateConverted;
            }
        }
    }
})();
