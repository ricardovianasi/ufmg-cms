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
   * @returns {{MODAL_SMALL: string, MODAL_MEDIUM: string, MODAL_LARGE: string, confirm: _confirm}}
   *
   * @constructor
   */
  function ModalService($uibModal) {
    /**
     * @param title
     * @param size
     *
     * @returns {*}
     *
     * @private
     */
    function _confirm(title, size) {
      size = size || ModalService.MODAL_MEDIUM;

      /**
       * @param $scope
       * @param $uibModalInstance
       * @param title
       *
       * @constructor
       */
      var ConfirmationModalController = function ($scope, $uibModalInstance, title) {
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
        controller: ConfirmationModalController,
        backdrop: 'static',
        size: size,
        resolve: {
          title: function () {
            return title;
          }
        }
      });
    }

    /**
     * @param {object} resolve
     *
     * @returns {*}
     *
     * @private
     */
    var _uploadImage = function (resolve) {
      return $uibModal.open({
        templateUrl: 'components/modal/upload-component.template.html',
        controller: 'UploadComponentController as vm',
        backdrop: 'static',
        size: 'xl',
        resolve: resolve
      });
    };

    return {
      MODAL_SMALL: 'sm',
      MODAL_MEDIUM: 'md',
      MODAL_LARGE: 'lg',
      confirm: _confirm,
      uploadImage: _uploadImage
    };
  }
})();
