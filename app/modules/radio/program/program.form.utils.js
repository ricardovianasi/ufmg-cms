(function() {
    'use strict';

    angular
        .module('radioModule')
        .factory('ProgramFormUtils', ProgramFormUtils);

    /** ngInject */
    function ProgramFormUtils(RadioService, PermissionService, $route) {
        var service = {
            checkValidateDate: checkValidateDate,
            getByWeekDay: getByWeekDay,
            createProgramServer: createProgramServer,
            createListDays: createListDays,
            createGridServer: createGridServer,
            createGrid: createGrid,
            initObjProgram: initObjProgram,
            getPermissions: getPermissions,
        };
        
        return service;

        ////////////////

        function getPermissions() {
            let originalPath = $route.current.$$route.originalPath;
            return {
                delete: PermissionService.canDelete('radio_programming'),
                put: PermissionService.canPut('radio_programming'),
                post: PermissionService.canPost('radio_programming'),
                isView: originalPath.indexOf('/view/') >= 0,
                isNew: originalPath.indexOf('/new') >= 0
            };
        }

        function checkValidateDate(dayTime, idProgram) {
            if(!dayTime.moment.start || !dayTime.moment.end) { return {result: []}; }
            let result = [
                {
                    isInvalid: dayTime.moment.start > dayTime.moment.end,
                    message: 'A hora de início não pode ser maior que a hora final.',
                    type: 'startBigger'
                },
                {
                    isInvalid: dayTime.moment.start.isSame(dayTime.moment.end),
                    message: 'A hora de início não pode ser igual a hora final.',
                    type: 'dateEqual'
                },
                {
                    isInvalid: false,
                    message: ' já esta alocado neste dia e horário.',
                    type: 'dayTimeAllocated'
                }
            ];
            RadioService.hasScheduleBusy(idProgram, dayTime.week_day, dayTime.time_start, dayTime.time_end)
                .then(function(res) {
                    let items = res.data.items;
                    if (!dayTime.moment.error && items.length) {
                        let grid = items[0];
                        let isSequence = dayTime.time_start === baseFormatHour(grid.time_end) ||
                            dayTime.time_end === baseFormatHour(grid.time_start);
                        if(isSequence) {
                            return;
                        }
                        result[2].isInvalid = true;
                        result[2].message = grid.program.title + result[2].message;
                        dayTime.moment.error = result[2];
                    }
                });
            dayTime.moment.error = result.find(function(error) { return error.isInvalid; });
            return !!dayTime.moment.error;
        }

        function baseFormatHour(time) {
            if (/(\d{2}:){2}/.test(time)) {
                return time.replace(/:\d{2}/, '');
            }
            return time;
        }

        function initObjProgram(data) {
            return {
                id: data ? data.id : '',
                title: data ? data.title : '',
                status: data ? data.status : 'published',
                highlight: data ? data.highlight : false,
                id_schedule: data && data.schedule ? data.schedule.id : null,
                description: data ? data.description: '',
                genre_id: data && data.genres[0] ? data.genres[0].id : null
            };
        }

        function getByWeekDay(list, weekDay) {
            let day;
            list.forEach(function(column) {
                if(!day) {
                    day = column.find(function(day) {
                        if (day.week_day === weekDay) { return true; }
                        return false;
                    });
                }
            });
            return day;
        }

        function createProgramServer(program) {
            let objProgram = angular.copy(program);
            objProgram.genres = objProgram.genre_id ? [objProgram.genre_id] : [];
            objProgram.id_parent = objProgram.id_parent;
            delete objProgram.image;
            delete objProgram.genre_id;
            delete objProgram.parent;
            return objProgram;
        }

        function createGrid(weekDay, start, end, idGrid) {
            return {
                time_start: start || '',
                time_end: end || '',
                idGrid: idGrid, 
                week_day: weekDay, 
                delete: false, 
                checked: true,
                moment: {}
            };
        }

        function createGridServer(grid, idProgram) {
            return {
                programming: idProgram,
                delete: grid.delete,
                idGrid: grid.idGrid, 
                time_start: grid.time_start, 
                time_end: grid.time_end, 
                week_day: grid.week_day, 
            };
        }

        function createListDays() {
            return [
                [
                    { idGrid: undefined, moment: { }, label: 'Seg', week_day: 1, checked: false, time_start: '', time_end: '', times: [ ] },
                    { idGrid: undefined, moment: { }, label: 'Sex', week_day: 5, checked: false, time_start: '', time_end: '', times: [ ] },
                ],
                [
                    { idGrid: undefined, moment: { }, label: 'Ter', week_day: 2, checked: false, time_start: '', time_end: '',  times: [ ] },
                    { idGrid: undefined, moment: { }, label: 'Sab', week_day: 6, checked: false, time_start: '', time_end: '',  times: [ ] },
                ],
                [
                    { idGrid: undefined, moment: { }, label: 'Qua', week_day: 3, checked: false, time_start: '', time_end: '',  times: [ ] },
                    { idGrid: undefined, moment: { }, label: 'Dom', week_day: 7, checked: false, time_start: '', time_end: '',  times: [ ] },
                ],
                [
                    { idGrid: undefined, moment: {}, label: 'Qui', week_day: 4, checked: false, time_start: '', time_end: '',  times: [ ] },
                    { label: 'Notícia Extraordinária', week_day: 0, checked: false, isExtraordinary: true },
                ]
            ];
        }
    }
})();