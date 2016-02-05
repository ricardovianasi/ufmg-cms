;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('MenuService', MenuService);

  MenuService.$inject = [
    '$http',
    '$filter',
    'apiUrl'
  ];

  function MenuService($http, $filter, apiUrl) {
    console.log('... MenuService');

    var MENU_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'menu');

    /**
     * @param {object} data
     *
     * @returns {object}
     *
     * @private
     */
    var _parseData = function (data) {
      var obj = {};

      /**
       * @param items
       */
      var buildMenuItems = function (items) {
        var menu = [];

        angular.forEach(items, function (item) {
          var menuItem = {
            page: item.page ? item.page.id : null,
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
      console.log(obj);
      return obj;
    };

    return {
      MENUS: {
        mainMenu: [],
        quickAccess: [],
      },
      /**
       * @returns {*}
       */
      get: function (menu) {
        return $http.get($filter('format')('{0}/{1}', MENU_ENDPOINT, inflection.underscore(menu)));
      },
      /**
       * @param menu
       * @param data
       *
       * @returns {*}
       */
      update: function (menu, data) {
        var url = $filter('format')('{0}/{1}', MENU_ENDPOINT, menu);

        data = _parseData(data);

        return $http.put(url, data);
      },
    };
  }
})();
