;(function () {
  'use strict';

  angular.module('componentsModule')
    .directive('publishmentOptions', PublishmentOptions);

  PublishmentOptions.$inject = [
    '$location',
    '$filter',
    'StatusService'
  ];

  /**
   * @param $location
   * @param $filter
   * @param StatusService
   *
   * @returns {{restrict: string, templateUrl: string, scope: {obj: string}, link: link}}
   *
   * @constructor
   */
  function PublishmentOptions($location, $filter, StatusService) {
    return {
      restrict: 'E',
      templateUrl: 'components/publishment/publishment.template.html',
      scope: {
        obj: '=routeModel',
        publishMethod: '=?publishMethod'
      },
      /**
       * @param $scope
       * @param element
       * @param attrs
       */
      link: function ($scope, element, attrs) {
        console.log('... PublishmentDirective');

        $scope.obj = $scope.$parent.$eval(attrs.routeModel);
        $scope.publish = $scope.$parent.publish || $scope.publishMethod;
        $scope.remove = $scope.$parent.remove;
        $scope.statuses = [];



        /**
         * @param $event
         */
        $scope.saveDraft = function ($event) {
          $event.stopPropagation();

          $scope.obj.status = StatusService.STATUS_DRAFT;
          $scope.obj.saveDraftClicked = true;
          $scope.publish($scope.obj);
        };

        /**
         * @param status
         */


        $scope.status = function (status) {
          console.log('ahduhsaduhsudshdusahdusahdsaudas >>>>>>>>>>>>>>>>>>>>>>>>', status);

          if(status !== StatusService.STATUS_PUBLISHED) {

            if(!$scope.isScheduled && status === StatusService.STATUS_SCHEDULED) {
              $scope.obj.status = StatusService.STATUS_PUBLISHED;
              $scope.obj.scheduled_date = '';
              $scope.obj.scheduled_time = '';
            } else if ($scope.isScheduled) {
              $scope.obj.status = StatusService.STATUS_SCHEDULED;
            } else {
              $scope.obj.status = status;
            }

            console.log('objeto status <<<<<<<<<<<<<<<<<<<<<<<<<<',$scope.obj.status);

          } else {
            if($scope.obj.scheduled_date === '' && $scope.obj.scheduled_time === '')
              $scope.obj.status = StatusService.STATUS_PUBLISHED;
            else {
              $scope.obj.scheduled_date = '';
              $scope.obj.scheduled_time = '';
              $scope.obj.status = StatusService.STATUS_PUBLISHED;
            }

          }

          console.log('objeto status salvo <<<<<<<<<<<<<<<<<<<<<<<<<<',$scope.obj.status);

        };

        /**
         *
         */
        $scope.back = function () {
          var back = $filter('format')('/{0}', inflection.pluralize(attrs.routeModel));

          if (typeof attrs.back !== 'undefined') {
            back = attrs.back;
          }

          $location.path(back);
        };

        // Statuses
        StatusService.getStatus().then(function (data) {
          $scope.statuses = data.data;
        });
      }
    };
  }
})();
