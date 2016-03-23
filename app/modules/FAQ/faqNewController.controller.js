;(function () {
  'use strict';

  angular.module('faqModule')
    .controller('faqNewController', faqNewController);

  faqNewController.$inject = [
    '$rootScope',
    'faqService',
    'NotificationService',
    '$location',
    '$routeParams',
    '$route'
  ];

  function faqNewController($rootScope, faqService, NotificationService, $location, $routeParams, $route) {

    /* jshint ignore:start */
    var vm = this;
    /* jshint ignore:end */

    $rootScope.shownavbar = true;
    console.log('... faNewController');

    var id = $routeParams.faqId;

    vm.idCurrentAskEdit  = '';
    vm.idCurrentCategoryEdit  = '';
    vm.showCategoryAsk = false;
    vm.showAsk = false;
    vm.faq = {
      items: [],
      categories: []
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

    /**
     *
     * @private
       */
    function _getFaq() {
      if(id) {
        faqService.get(id).then(function(data){
          vm.faq = data.data;
          vm.faq.categories = [];

          var ids = [];

          angular.forEach(data.data.items, function(v, k) {
            if(data.data.items[k].children.length > 0) {
              vm.faq.categories.push({
                name: data.data.items[k].question,
                items: data.data.items[k].children
              });

              ids.push(k);

            }
          });

          angular.forEach(ids, function(v, k){
            if(ids[k] === 0) {
              data.data.items.splice(ids[k]);
            } else {
              data.data.items.splice(ids[k], 1);
            }
          });

         console.log('data >>>>>>>>>>>>', data.data.items);

          if(vm.faq.categories.length < 1)
            _showType('ask');
          else
            _showType('');
        });
      }
    }

    _getFaq();

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
        vm.idCurrentAskEdit = '';
        vm.faq.items.push(ask);

        _controlFormView(false);

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
          $route.reload();
          _getFaq();
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
      vm.idCurrentCategoryEdit = '';
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
    function _removeFaqCategory(id) {
      vm.faq.categories.splice(id, 1);
    }

    /**
     *
     * @param id
     * @private
       */
    function _removeforEditAsk(id) {
      vm.faq.items.splice(id, 1);
    }

    /**
     *
     * @param id
     * @private
     */
    function _editCategory(id) {
      vm.idCurrentCategoryEdit = id;
      vm.currentNewCategoryAsk =  (JSON.parse(JSON.stringify(vm.faq.categories[id])));
      _removeFaqCategory(id);
      _controlFormView(false);
    }

    /**
     *
     * @param id
     * @private
     */
    function _editAsk(id) {
      vm.idCurrentAskEdit = id;
      vm.newAsk = (JSON.parse(JSON.stringify(vm.faq.items[id])));
      _removeforEditAsk(id);
      _controlFormView(false);
    }
  }

})();
