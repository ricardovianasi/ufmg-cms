(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('MenuService', MenuService);

    /** ngInject */
    function MenuService($http, $filter, apiUrl, $log) {
        $log.info('MenuService');

        var MENU_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'menu');

        var _parseData = function (data) {
            var obj = {};

            var buildMenuItems = function (items) {
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
                        menuItem.children = buildMenuItems(item.children);

                    }

                    menu.push(menuItem);
                });

                return menu;
            };

            obj.items = buildMenuItems(data);

            return obj;
        };

        return {
            MENUS: {
                mainMenu: [],
                quickAccess: [],
            },
            get: function (menu) {
                return $http.get($filter('format')('{0}/{1}', MENU_ENDPOINT, inflection.underscore(menu))); // jshint ignore: line
            },
            update: function (menu, data) {
                var url = $filter('format')('{0}/{1}', MENU_ENDPOINT, menu);

                data = _parseData(data);

                return $http.put(url, data);
            },
        };
    }
})();
