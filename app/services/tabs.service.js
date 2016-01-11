;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('tabsService', tabsService);

  /**
   * @returns {{getTabs: _getTabs, selectTab: _selectTab}}
   */
  function tabsService() {
    clog('... TabsService');

    var tabs = {
      home: true,
      midia: false,
      crop: false
    };

    return {
      getTabs: _getTabs,
      selectTab: _selectTab
    };

    /**
     * @returns {{home: boolean, midia: boolean, crop: boolean}}
     *
     * @private
     */
    function _getTabs() {
      return tabs;
    }

    /**
     * @param nextTab
     *
     * @private
     */
    function _selectTab(nextTab) {
      angular.forEach(tabs, function (value, key) {
        tabs[key] = key == nextTab;
      });
    }
  }
})();
