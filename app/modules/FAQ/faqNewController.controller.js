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
    var idCurrentCategoryEdit  = '';
    var idCurrentAskEdit  = '';

    vm.showCategoryAsk = false;
    vm.showAsk = false;
    vm.faq = {
      items: []
    };

    vm.currentNewCategoryAsk = {
      title: '',
      items: []
    };

    vm.showType = _showType;
    vm.addAsk = _addAsk;
    vm.controlFormView = _controlFormView;
    vm.save = _save;
    vm.removeAsk = _removeAsk;
    vm.addCategoryAsk = _addCategoryAsk;
    vm.removeFaqCategoryAsk = _removeFaqCategoryAsk;
    vm.editCategory = _editCategory;
    vm.editAsk = _editAsk;

    if(id) {
      faqService.get(id).then(function(data){
        vm.faq = data.data;

        if(vm.faq.items.length > 0)
          _showType('ask');
        else
          _showType('');
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
     * @param type
     * @param ask
       * @private
       */
    function _addAsk(type, ask) {
      if(type === 'ask') {

        if(idCurrentAskEdit !== ''){
          vm.faq.items[idCurrentAskEdit] = (JSON.parse(JSON.stringify(vm.newAsk)));
          idCurrentAskEdit = '';
        }
        else
          vm.faq.items.push(ask);

        _controlFormView(true);

      } else {
        vm.currentNewCategoryAsk.items.push(ask);
      }

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
      _verifyType();

      if(id) {
        faqService.update(vm.faq).then(function (data) {
          $location.path('/faq/edit/' + data.data.id);
          NotificationService.success('FAQ alterado com sucesso!');
        });
      } else {
        faqService.save(vm.faq).then(function (data) {
          $location.path('/faq/edit/' + data.data.id);
          NotificationService.success('FAQ salvo com sucesso!');
        });
      }

    }

      /**
       *
       * @param idx
       * @private
       */
    function _removeAsk(type, idx) {
      if(type === 'ask')
        vm.faq.items.splice(idx, 1);
      else if(type === 'category')
        vm.faq.categories.splice(idx, 1);
      else
        vm.currentNewCategoryAsk.items.splice(idx, 1);
    }

      /**
       *
       * @private
       */
    function _addCategoryAsk(){

      if(idCurrentCategoryEdit !== '') {
        vm.faq.categories[idCurrentCategoryEdit] = (JSON.parse(JSON.stringify(vm.currentNewCategoryAsk)));
        idCurrentCategoryEdit = '';
      }
      else
        vm.faq.categories.push(vm.currentNewCategoryAsk);

      _cleanCurrentNewCategoryAsk();
      _controlFormView(true);
    }

    /**
     *
     * @private
     */
    function _cleanCurrentNewCategoryAsk() {
      vm.currentNewCategoryAsk = {
        title: '',
        items: []
      };
    }

    /**
     *
     * @private
       */
    function _verifyType() {
      if(vm.showCategoryAsk) {
        vm.faq.items = [];
      } else {
        vm.faq.categories = [];
      }
    }

      /**
       *
       * @param parentIdx
       * @param idx
       * @private
       */
    function _removeFaqCategoryAsk(parentIdx, idx) {
      vm.faq.categories[parentIdx].items.splice(idx, 1);
    }

      /**
       *
       * @param id
       * @private
       */
    function _editCategory(id) {
      idCurrentCategoryEdit = id;
      vm.currentNewCategoryAsk =  (JSON.parse(JSON.stringify(vm.faq.categories[id])));
      _controlFormView(false);
    }

    /**
     *
     * @param id
     * @private
     */
    function _editAsk(id) {
      idCurrentAskEdit = id;
      vm.newAsk = (JSON.parse(JSON.stringify(vm.faq.items[id])));
      _controlFormView(false);
    }
  }

})();
