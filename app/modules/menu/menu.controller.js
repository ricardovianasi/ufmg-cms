;(function () {
  'use strict';

  angular.module('menuModule')
    .controller('MenuController', MenuController);

  MenuController.$inject = [
    //'$route',
    'NotificationService',
    'ModalService',
    'MenuService',
    'PagesService',
  ];

  /**
   * @param $route
   * @param NotificationService
   * @param ModalService
   * @param MenuService
   * @param PagesService
   *
   * @constructor
   */
  function MenuController(/*$route,*/
                          NotificationService,
                          ModalService,
                          MenuService,
                          PagesService) {
    console.log('... NoticiasController');

    var vm = this;
    var pages = [];
    var menus = MenuService.MENUS;
    //var menus = {
    //  mainMenu: [],
    //  quickAccess: [],
    //};

    vm.pages = [];
    vm.menus = {};

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
      update: function (event, ui) {
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
            ui.item.sortable.droptargetModel == vm.quickAccess
          ) {
            var exists = !!vm.quickAccess.filter(function (x) {
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
    vm.save = _save;

    /**
     * @param menu
     * @param idx
     *
     * @private
     */
    function _removeItem(menu, idx) {
      ModalService
        .confirm('Deseja remover o item?')
        .result
        .then(function () {
          vm.menus[menu].splice(idx, 1);
        });
    }

    /**
     * @param menu
     * @param idx
     *
     * @private
     */
    function _editTitle(menu, idx) {
      if (typeof vm.menus[menu][idx].newTitle === 'undefined') {
        vm.menus[menu][idx].newTitle = vm.menus[menu][idx].label;
      }

      vm.menus[menu][idx].editTitle = true;
    }

    /**
     * @param menu
     *
     * @private
     */
    function _save(menu) {
      MenuService.update(inflection.underscore(menu), vm.menus[menu]).then(function () {
        NotificationService.success('Menu salvo com sucesso!');
      });
    }

    PagesService.getPages().then(function (data) {
      angular.forEach(data.data.items, function (page) {
        pages.push({
          page: page.id,
          label: page.title,
          target_blank: null,
          external_url: null,
          children: [],
        });
      });

      vm.pages = pages.slice();
    });

    //Populate menus
    angular.forEach(menus, function (value, menu) {
      MenuService.get(menu).then(function (data) {
        menus[menu] = data.data.items;
        vm.menus[menu] = [];

        angular.forEach(menus[menu], function (item) {
          vm.menus[menu].push({
            page: item.page ? item.page.id : null,
            label: item.label,
            target_blank: null,
            external_url: null,
            children: [],
          });
        });
      });
    });
  }
})();
