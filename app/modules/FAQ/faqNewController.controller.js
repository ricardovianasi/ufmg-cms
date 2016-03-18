;(function () {
  'use strict';

  angular.module('faqModule')
    .controller('faqNewController', faqNewController);

  faqNewController.$inject = [
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param $route
   * @param dataTableConfigService
   * @param EventsService
   * @param DateTimeHelper
   * @param ModalService
   * @param NotificationService
   *
   * @constructor
   */
  function faqNewController($rootScope) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... faNewController');


    vm.showCategoryAsk = false;
    vm.showAsk = false;
    vm.faq = {
      items: []
    };

    vm.showType = _showType;
    vm.addAsk = _addAsk;
    vm.controlFormView = _controlFormView;


    /**
     *
     * @param type
     * @private
       */
    function _showType(type) {
      console.log(type);
      if(type == 'ask') {
        vm.showCategoryAsk = false;
        vm.showAsk = true;
      } else {
        vm.showCategoryAsk = true;
        vm.showAsk = false;
      }

      vm.showNewAskForm = true;
    }

    /**
     *
     * @param ask
     * @private
     */
    function _addAsk(ask) {
      vm.faq.items.push(ask);
      _controlFormView(true);
      _cleanNewAsk();
    }

    /**
     *
     * @param defaultAction
     * @private
     */
    function _controlFormView(defaultAction) {
      if(defaultAction) {
        vm.showNewAskForm = false;
        vm.showAddAsk = true;
      } else {
        vm.showNewAskForm = true;
        vm.showAddAsk = false;
      }
    }

    /**
     *
     * @private
     */
    function _cleanNewAsk() {
      vm.newAsk = {
        question: '',
        answer: ''
      };
    }
  }
})();
