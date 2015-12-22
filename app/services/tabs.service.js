;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('tabsService', tabsService);

  function tabsService() {
    console.log('... TabsService');

    var tabs = {
      home: false,
      midia: false,
      crop: false
    };

    return {
      getTabs: getTabs,
      selectTab: selectTab
    };

    function getTabs(){
      return tabs;
    }

    function selectTab(nextTab) {
      angular.forEach(tabs, function(value, key) {
          if(key == nextTab)
            tabs[key] = true;
          else
            tabs[key] = false;
      });

      console.log(tabs);
    }
  }
})();
