;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('tabsService', tabsService);

  function tabsService() {
    console.log('... TabsService');

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
     * @return {tabs}
     */
    function _getTabs(){
      return tabs;
    }

    /**
     * @param  {nextTab}
     * @return {organized tabs}
     */
    function _selectTab(nextTab) {
      angular.forEach(tabs, function(value, key) {
          if(key == nextTab)
            tabs[key] = true;
          else
            tabs[key] = false;
      });
    }
  }
})();
