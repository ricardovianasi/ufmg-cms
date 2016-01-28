;(function () {
  'use strict';

  angular.module('menuModule')
    .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$scope',
    'NotificationService',
    'DateTimeHelper',
    'ModalService',
    'PagesService',
  ];

  /**
   * @param $scope
   * @param NotificationService
   * @param DateTimeHelper
   * @param ModalService
   * @param PagesService
   *
   * @constructor
   */
  function MenuController($scope,
                          NotificationService,
                          DateTimeHelper,
                          ModalService,
                          PagesService) {
    console.log('... NoticiasController');

    var vm = this;

    var pages = [];
    vm.pages = [];
    vm.menu = [];

    vm.sortableOptions = {
      placeholder: 'list-group-item',
      connectWith: '.main',
      /**
       * @param e
       * @param ui
       */
      stop: function (e, ui) {
        // if the element is removed from the first container
        if (
          $(e.target).hasClass('selectable') &&
          ui.item.sortable.droptarget &&
          e.target != ui.item.sortable.droptarget[0]
        ) {
          // clone the original model to restore the removed item
          vm.pages = pages.slice();
        }
      },
      /**
       * @param event
       * @param ui
       */
      update: function(event, ui) {
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        if (!ui.item.sortable.received) {
          var originNgModel = ui.item.sortable.sourceModel;
          var itemModel = originNgModel[ui.item.sortable.index];

          // check that its an actual moving
          // between the two lists
          if (
            originNgModel == vm.pages &&
            ui.item.sortable.droptargetModel == vm.menu
          ) {
            var exists = !!vm.menu.filter(function(x) {
              return x.title === itemModel.title;
            }).length;

            if (exists) {
              ui.item.sortable.cancel();
            }
          }
        }
      },
    };

    vm.removeItem = _removeItem;
    vm.editTitle = _editTitle;

    /**
     * @param idx
     *
     * @private
     */
    function _removeItem(idx) {
      vm.menu.splice(idx, 1);
    }

    /**
     * @param idx
     *
     * @private
     */
    function _editTitle(idx) {
      if (typeof vm.menu[idx].newTitle === 'undefined') {
        vm.menu[idx].newTitle = vm.menu[idx].title;
      }

      vm.menu[idx].editTitle = true;
    }

    PagesService.getPages().then(function (data) {
      angular.forEach(data.data.items, function (page) {
        pages.push({
          id: page.id,
          title: page.title,
        });
      });

      vm.pages = pages.slice();
    });
  }
})();
