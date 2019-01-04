(function() {
    'use strict';

    angular
        .module('radioModule')
        .factory('ProgramFormValidate', ProgramFormValidate);

    /** ngInject */
    function ProgramFormValidate(RadioService, $q) {
        var service = {
            isValidControlForm: isValidControlForm,
            checkValidateDate: checkValidateDate,
            checkGridValid: checkGridValid,
        };

        return service;

        ////////////////
        function isValidControlForm(form, field, submit) {
            let control = form[field];
            let isValid = control.$valid || !control.$touched;
            if (submit) {
                isValid = !form.$submitted || isValid;
            }
            return isValid;
        }

        function checkGridValid(listDays) {
            return listDays.reduce(function(rows, columns) {
                return rows.concat(columns);
            }, [])
            .reduce(function(resultDays, day) { return resultDays.concat(day.times).concat(day); }, [])
            .find(function(day) { return day && !day.isExtraordinary && day.moment.error && !day.delete; });
        }

        function checkValidateDate(dayTime, idProgram, mainDay) {
            let defer = $q.defer();
            defer.resolve();
            if(!dayTime.moment.start || !dayTime.moment.end) { return defer.promise; }
            let result = _getAbleErros(dayTime.moment.start, dayTime.moment.end);
            result = _checkAllocatedSameProgram(dayTime, mainDay, result);
            if(!result.typeError) {
                defer.promise = _checkAllocatedTime(idProgram, dayTime)
                    .then(function (res) {
                        if(res.hasError) {
                            result.dayTimeAllocated.isInvalid = true;
                            result.dayTimeAllocated.message =
                                _getMessageInvalidHour(res.grid.program.title, res.grid.time_start, res.grid.time_end);
                            result.typeError = result.dayTimeAllocated.type;
                            _setError(dayTime.moment, result.dayTimeAllocated);
                        }
                    });
            }
            _setError(dayTime.moment, result[result.typeError]);
            return defer.promise;
        }

        function _setError(obj, error) {
            if(obj) {
                obj.error = error || undefined;
            }

        }

        function _getAbleErros(momentStart, momentEnd) {
            let error = {
                startBigger: {
                    isInvalid: momentStart > momentEnd,
                    message: 'A hora de início não pode ser maior que a hora final.',
                    type: 'startBigger'
                },
                dateEqual: {
                    isInvalid: momentStart.isSame(momentEnd),
                    message: 'A hora de início não pode ser igual a hora final.',
                    type: 'dateEqual'
                },
                dayTimeAllocated: {
                    isInvalid: false,
                    message: ' já esta alocado neste dia e horário.',
                    type: 'dayTimeAllocated'
                },
                typeError: ''
            };
            error.typeError = Object.keys(error).reduce(function(result, key) {
                if(error[key].isInvalid) { return error[key].type; }
                return result;
            }, '');
            return error;
        }

        function _checkAllocatedSameProgram(dayTime, mainDay, resultError) {
            if(resultError.typeError) {
                return resultError;
            }
            let day = angular.copy(mainDay);
            day.times.push({ moment: day.moment, time_start: day.time_start, time_end: day.time_end });
            let idxTime = day.times.findIndex(time => time.time_start === dayTime.time_start && time.time_end === dayTime.time_end);
            day.times.splice(idxTime, 1);

            let timesAllocated = day.times.filter(time =>
                dayTime.moment.start >= time.moment.start && dayTime.moment.start < time.moment.end ||
                dayTime.moment.end > time.moment.start && dayTime.moment.end <= time.moment.end);
            if(timesAllocated.length) {
                resultError.dayTimeAllocated.isInvalid = true;
                resultError.dayTimeAllocated.message =
                _getMessageInvalidHour('Este programa', timesAllocated[0].time_start, timesAllocated[0].time_end);
                resultError.typeError = resultError.dayTimeAllocated.type;
            }
            return resultError;
        }

        function _checkAllocatedTime(idProgram, {week_day, time_start, time_end}) {
            return RadioService.hasScheduleBusy(idProgram, week_day, time_start, time_end)
                .then(function(res) {
                    let items = res.data.items;
                    if (!items.length) {
                        return { hasError: false };
                    }
                    let grid = items[0];
                    let isSequence =
                        time_start === _baseFormatHour(grid.time_end) || time_end === _baseFormatHour(grid.time_start);
                    if(isSequence) {
                        return { hasError: false };
                    }
                    return { hasError: true, grid: grid };
                });
        }

        function _getMessageInvalidHour(titleProgram, hourStart, hourEnd) {
            return '<b>' + titleProgram + '</b> já esta alocado neste dia e horário. (' +
            _baseFormatHour(hourStart) + ' às ' + _baseFormatHour(hourEnd) + ')';
        }

        function _baseFormatHour(time) {
            if (/(\d{2}:){2}/.test(time)) {
                return time.replace(/:\d{2}$/, '');
            }
            return time;
        }
    }
})();
