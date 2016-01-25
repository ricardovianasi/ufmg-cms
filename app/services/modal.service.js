;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('ModalService', ModalService);

  ModalService.$inject = [
    '$uibModal',
  ];

  /**
   * @param $uibModal
   *
   * @returns {ModalService}
   *
   * @constructor
   */
  function ModalService($uibModal) {
    var vm = this;

    vm.confirm = _confirm;

    /**
     * @param title
     * @param size
     *
     * @returns {*}
     *
     * @private
     */
    function _confirm(title, size) {
      size = size || 'sm';

      /**
       * @param $scope
       * @param $uibModalInstance
       * @param title
       *
       * @constructor
       */
      var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
        $scope.modal_title = title;

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      };

      return $uibModal.open({
        templateUrl: 'components/modal/confirmation.modal.template.html',
        controller: ConfirmationModalCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          title: function () {
            return title;
          }
        }
      });
    }

    return vm;
  }
})();
