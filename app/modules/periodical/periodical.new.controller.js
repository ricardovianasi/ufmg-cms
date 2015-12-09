;(function(){
'use strict';

angular
  .module("periodicalModule")
  .controller("PeriodicalNewController", PeriodicalNewController);

  PeriodicalNewController.$inject = [
    '$scope',
    '$routeParams',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
    'DateTimeHelper',
    '$location'
  ];

  function PeriodicalNewController($scope, $routeParams, PeriodicalService, StatusService, NotificationService, MediaService, DateTimeHelper, $location) {
        console.log('... PeriodicalNewController');

        $scope.status = [];

        StatusService.getStatus().then(function(data) {
        	$scope.status = data.data;
        });

        $scope.$watch('add_photos', function () {
            if ($scope.add_photos) {
                MediaService.newFile($scope.add_photos).then(function(data){
                    $scope.periodical.url = data.url;
                    $scope.periodical.logo = data.id;
                });
            }
        });

        $scope.date_formats = [
            { id: 'Y' },
            { id: 'm/Y' },
            { id: 'd/m/Y' }
        ];

        $scope.removeImage = function () {
            $scope.periodical.logo = '';
            $scope.periodical.url = '';
        };

    	$scope.publish = function (data) {
            var _data = angular.copy(data);
            delete _data.url;
    		PeriodicalService.newPeriodical(_data).then(function(data) {
    			NotificationService.success('Periódico criado com sucesso.');
                $location.path('/periodicals');
    		});
    	};
  }
})();
