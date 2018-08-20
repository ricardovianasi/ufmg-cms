(function() {
    'use strict';

    angular
        .module('radioModule')
        .factory('ProgramFormUtils', ProgramFormUtils);

    /** ngInject */
    function ProgramFormUtils() {
        var service = {
            checkValidateDate: checkValidateDate,
            getByWeekDay: getByWeekDay,
            createProgramServer: createProgramServer,
            createListDays: createListDays,
            createGridServer: createGridServer,
            createGrid: createGrid,
            initObjProgram: initObjProgram,
        };
        
        return service;

        ////////////////

        function checkValidateDate(dayTime) {
            if(!dayTime.moment.start || !dayTime.moment.end) { return {}; }
            let result = {
                startBigger: dayTime.moment.start > dayTime.moment.end,
                dateEqual: dayTime.moment.start === dayTime.moment.end
            };
            dayTime.moment.isInvalid = result.startBigger || result.dateEqual;
            return { isInvalid: dayTime.moment.isInvalid, result: result };
        }

        function initObjProgram(data) {
            return {
                id: data.id,
                title: data.title,
                id_parent: data.parent ? data.parent.id : null,
                description: data.description,
                genre_id: data.genres[0] ? data.genres[0].id : null
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