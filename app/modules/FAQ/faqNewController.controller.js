;(function () {
  'use strict';

  angular.module('faqModule')
    .controller('faqNewController', faqNewController);

  faqNewController.$inject = [
    '$rootScope',
    'faqService',
    'NotificationService',
    '$location',
    '$routeParams'
  ];

  function faqNewController($rootScope, faqService, NotificationService, $location, $routeParams) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... faNewController');

    var id = $routeParams.faqId;
    vm.showCategoryAsk = false;
    vm.showAsk = false;
    vm.faq = {
      items: []
    };

    vm.showType = _showType;
    vm.addAsk = _addAsk;
    vm.controlFormView = _controlFormView;
    vm.save = _save;
    vm.removeAsk = _removeAsk;


    if(id) {
      faqService.get(id).then(function(data){
        vm.faq = data.data;
        _showType('ask');
      });
    }

    /**
     *
     * @param type
     * @private
       */
    function _showType(type) {
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

    /**
     *
     * @private
       */
    function _save() {
      var faq = {};

      if(id) {
        faqService.update(vm.faq).then(function (data) {
          $location.path('/faq/edit/' + data.data.id);
          NotificationService.success('Faq Alterado com sucesso!');
        });
      } else {
        faqService.save(vm.faq).then(function (data) {
          $location.path('/faq/edit/' + data.data.id);
          NotificationService.success('Faq salvo com sucesso!');
        });
      }

    }

      /**
       *
       * @param idx
       * @private
       */
    function _removeAsk(idx) {
      vm.faq.items.splice(idx);
    }
  }
})();
