;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('UploadService', ['$q', '$http', 'Upload', function ($q, $http, Upload) {
      clog('... UploadService');

      return {
        uploadPhoto: function (files) {
          var deferred = $q.defer();

          /**
           * @param data
           */
          var success = function (data) {
            deferred.resolve(data);
          };

          //var progress = function (evt) {
          //  // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          //  // $scope.log = 'progress: ' + progressPercentage + '% ' +
          //  //             evt.config.file.name + '\n' + $scope.log;
          //};

          if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];

              Upload
                .upload({
                  url: APIUrl + '/file',
                  fields: {
                    title: files[i].title,
                    file: files[i].file,
                    legend: files[i].legend,
                    description: files[i].description,
                    alt_text: files[i].alt_text
                  },
                  file: file[i]
                })
                //.progress(progress)
                .success(success)
              ;
            }
          }

          return deferred.promise;
          // var deferred = $q.defer();
          // $http.get(APIUrl+'/file', ).then(function(data){
          //   deferred.resolve(data);
          // })
          // return deferred.promise;
        }
      };
    }]);
})();
