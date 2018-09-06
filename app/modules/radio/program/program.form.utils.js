(function() {
    'use strict';

    angular
        .module('radioModule')
        .factory('ProgramFormUtils', ProgramFormUtils);

    /** ngInject */
    function ProgramFormUtils(PermissionService, $route) {
        var service = {
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

        function _getObjDay(nameDay, weekDay, isExtraordinary) {
            return {
                idGrid: undefined,
                moment: { },
                label: nameDay,
                week_day: weekDay,
                checked: false,
                time_start: '',
                time_end: '',
                times: [ ],
                isExtraordinary: isExtraordinary
            };
        }

        function createListDays() {
            return [
                [ _getObjDay('Seg', 1), _getObjDay('Sex', 5) ],
                [ _getObjDay('Ter', 2), _getObjDay('Sab', 6) ],
                [ _getObjDay('Qua', 3), _getObjDay('Dom', 7) ],
                [ _getObjDay('Qui', 4), _getObjDay('Notícia Extraordinária', 0, true) ],
            ];
        }
    }
})();
