;(function () {
  'use strict';

  angular.module('menuModule')
    .controller('MenuController', MenuController);

  MenuController.$inject = [
    '$scope',
    'NotificationService',
    'ModalService',
    'MenuService',
    'PagesService',
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param NotificationService
   * @param ModalService
   * @param MenuService
   * @param PagesService
   *
   * @constructor
   */
  function MenuController($scope,
                          NotificationService,
                          ModalService,
                          MenuService,
                          PagesService,
                          $rootScope) {

    $rootScope.shownavbar = true;
    console.log('... NoticiasController');

    var vm = this;
    var pages = [];
    var menus = MenuService.MENUS;

    //Public functions
    vm.removeItem = _removeItem;
    vm.editTitle = _editTitle;
    vm.save = _save;
    vm.newGroup = _newGroup;
    vm.removeQuickAccessItem = _removeQuickAccessItem;

    //Public models
    vm.pages = [];
    $scope.menus = {};
    vm.sortableOptions = {
      disabled: false,
      placeholder: 'list-group-item',
      connectWith: '.main',
      /**
       * @param e
       * @param ui
       */
      stop: function (e, ui) {
        // if the element is removed from the first container
        //if (
        //  $(e.target).hasClass('selectable') &&
        //  ui.item.sortable.droptarget &&
        //  e.target != ui.item.sortable.droptarget[0]
        //) {
        //  // clone the original model to restore the removed item
        //  //vm.pages = pages.slice();
        //}
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
            originNgModel == vm.pages ||
            ui.item.sortable.droptargetModel == $scope.menus.quickAccess
          ) {
            var exists = !!$scope.menus.quickAccess.filter(function (x) {
              return x.label === itemModel.label;
            }).length;

            if (exists) {
              ui.item.sortable.cancel();
            }
          }
        }
      },
    };

    vm.quickSortableOptions = {
      placeholder: 'list-group-item-quickaccess',
      connectWith: '.main',
      /**
       * @param e
       * @param ui
       */
      stop: function (e, ui) {
        // if the element is removed from the first container
        //if (
        //  $(e.target).hasClass('selectable') &&
        //  ui.item.sortable.droptarget &&
        //  e.target != ui.item.sortable.droptarget[0]
        //) {
        //  // clone the original model to restore the removed item
        //  //vm.pages = pages.slice();
        //}
      },
      /**
       * @param event
       * @param ui
       */
      update: function (event, ui) {
        console.log(event, ui);
        // on cross list sortings received is not true
        // during the first update
        // which is fired on the source sortable
        if (!ui.item.sortable.received) {
          var originNgModel = ui.item.sortable.sourceModel;
          var itemModel = originNgModel[ui.item.sortable.index];


          // check that its an actual moving
          // between the two lists
          if (
            originNgModel == vm.quickPages ||
            ui.item.sortable.droptargetModel == $scope.menus.quickAccess
          ) {
            var exists = !!$scope.menus.quickAccess.filter(function (x) {
              return x.label === itemModel.label;
            }).length;

            if (exists) {
              ui.item.sortable.cancel();
            }
          }
        }
      },
    };

    /**
     * @param menu
     * @param idx
     *
     * @private
     */
    function _removeItem() {
      var args = Array.prototype.slice.call(arguments);
      var allArgs = Array.prototype.slice.call(arguments);

      ModalService
        .confirm('Deseja remover o item?')
        .result
        .then(function () {
          var base = 0;
          angular.forEach(allArgs, function (i) { base++; });

          var spliceAux = allArgs.splice(0, 1)[0];

          var menu = args.splice(0, 1)[0];
          var idx = base > 3 ? args.splice(2, 1)[0] : args.splice(1, 1)[0];

          if(idx === undefined)
            idx =  args.splice(0, 1)[0];

          var menuName = 'menus.'+menu;

          /*
           menus.mainMenu[0]
           menus.mainMenu[0].children[0]
           menus.mainMenu[0].children[0].children[0]
           */
          var auxInterator = 0;

          angular.forEach(allArgs, function (i) {

            if(auxInterator !== 2 && allArgs.length === 3)
              menuName += '['+i+'].children';
            else if(auxInterator !== 1 && allArgs.length === 2)
              menuName += '['+i+'].children';
            else
              console.log('ready');

            auxInterator++;
          });

          var item = $scope.$eval(menuName);

          vm.pages.push(item[idx]);
          item.splice(idx, 1);
        });
    }

      /**
       *
       * @param idx
       * @private
       */
    function _removeQuickAccessItem(idx){
      ModalService
        .confirm('Deseja remover o item?')
        .result
        .then(function () {
          console.log('vai toma no cu');
          vm.quickPages.push($scope.menus.quickAccess[idx]);
          $scope.menus.quickAccess.splice(idx, 1);
        });
    }

    /**
     * @param idx
     *
     * @private
     */
    function _editTitle(idx) {

      if (typeof idx.newTitle === 'undefined') {
        idx.newTitle = idx.label;
      }

      idx.editTitle = true;
    }


    /**
     * @param type
     *
     * @private
     */
    function _save(type) {
      MenuService.update(inflection.underscore(type), $scope.menus[type]).then(function () {
        NotificationService.success('Menu salvo com sucesso!');
      });
    }

    /**
     * @param {string} type
     */
    function _newGroup(type) {
      $scope.menus[type].push({
        page: null,
        label: 'Novo grupo',
        target_blank: null,
        external_url: null,
        children: [],
      });
    }

    /**
     * @private
     */
    function _populateMenus() {
      angular.forEach(menus, function (value, type) {
        MenuService.get(type).then(function (data) {
          menus[type] = data.data.items;
          $scope.menus[type] = [];

          _populateMenusChildren(type);
          _removePagesIndexed(type, data.data.items);
        });
      });
    }

    /**
     * @param type
     *
     * @private
     */
    function _populateMenusChildren(type) {
      angular.forEach(menus[type], function (item) {
        $scope.menus[type].push({
          page: item.page ? item.page.id : null,
          label: item.label,
          target_blank: null,
          external_url: null,
          children: item.children || false,
        });
      });
    }

    /*
     * SERVICES
     */

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
      vm.quickPages =  (JSON.parse(JSON.stringify(vm.pages)));

      //Populate menus (type: quick_access, main_menu)
      _populateMenus();
    });

      /**
       *
       * @param menuItems
       * @private
       */
    function _removePagesIndexed(menuType, menuItems) {

      angular.forEach(menuItems, function(value, key){

        if(menuType == 'mainMenu') {
          angular.forEach(vm.pages, function (v, k) {
            if (menuItems[key].page.id == vm.pages[k].page)
              vm.pages.splice(k, 1);
          });
        } else {
          angular.forEach(vm.quickPages, function (v, k) {
            if (menuItems[key].page.id == vm.quickPages[k].page)
              vm.quickPages.splice(k, 1);
          });
        }

        if(menuItems[key].children.length > 0);
          _removePagesIndexed(menuType, menuItems[key].children);
      });
    }


  }
})();
