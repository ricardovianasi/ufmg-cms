(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('MenuService', MenuService);

    /** ngInject */
    function MenuService($http, $filter, apiUrl, $log) {
        $log.info('MenuService');
        
        var MENU_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'menu');

        var service = {
            MENUS: { mainMenu: [], quickAccess: [] },
            get: get,
            update: update,
            parseMenuToMenuFlat: parseMenuToMenuFlat,
            searchDeep: searchDeep
        };

        return service;

        function get(menu) {
            return $http.get($filter('format')('{0}/{1}', MENU_ENDPOINT, inflection.underscore(menu))); // jshint ignore: line
        }

        function update(menu, data) {
            var url = $filter('format')('{0}/{1}', MENU_ENDPOINT, menu);

            data = _parseData(data);

            return $http.put(url, data);
        }

        function searchDeep(list, id) {
            let found;
            for(var i = 0; i < list.length; i++) {
                if(list[i].id === id) {
                    return list[i];
                }
                if (list[i].children.length) {
                    found = searchDeep(list[i].children, id);
                }
                if(found) {
                    return found;
                }
            }
            return null;
        }

        function parseMenuToMenuFlat(menuMain) {
            let listOptions = [];
            menuMain.forEach(function (optPrimary) {
                _addItem(listOptions, optPrimary, 1);
                optPrimary.children.forEach(function (optSecondary) {
                    _addItem(listOptions, optSecondary, 2, optPrimary);
                    optSecondary.children.forEach(function (optTertiary) {
                        _addItem(listOptions, optTertiary, 3, optSecondary);
                    });
                });
            });
            return listOptions;
        }

        function _addItem(list, opt, level, optParent) {
            opt.level = level;
            opt.parent = optParent;
            list.push(opt);
        }

        function _parseData(data) {
            var obj = {};

            obj.items = _buildMenuItems(data);

            return obj;
        }

        function _buildMenuItems(items) {
            var menu = [];

            angular.forEach(items, function (item) {
                let page = item.page;
                if(page && page.id) {
                    page = item.page.id;
                }
                var menuItem = {
                    page: page,
                    label: item.newTitle || item.label,
                    target_blank: item.target_blank,
                    external_url: item.external_url,
                    children: [],
                };

                if (item.children.length) {
                    menuItem.children = _buildMenuItems(item.children);

                }

                menu.push(menuItem);
            });

            return menu;
        }

    }
})();
