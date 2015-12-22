;(function () {
  "use strict";

  angular
    .module("periodicalModule")
    .controller("PeriodicalEditionEditController", PeriodicalEditionEditController);

  PeriodicalEditionEditController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
    'DateTimeHelper',
    '$location',
    '$timeout'
  ];

  function PeriodicalEditionEditController($scope,
                                           $modal,
                                           $routeParams,
                                           PeriodicalService,
                                           StatusService,
                                           NotificationService,
                                           MediaService,
                                           DateTimeHelper,
                                           $location,
                                           $timeout) {
    console.log('... PeriodicalEditionEditController');
    $scope.edition = {};
    $scope.status = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    PeriodicalService.getEdition($routeParams.id, $routeParams.edition).then(function (data) {
      $scope.periodical = data.data.periodical;
      $scope.edition.theme = data.data.theme;
      $scope.edition.number = data.data.number;
      $scope.edition.publish_date = DateTimeHelper.dateToStr(data.data.publish_date);
      $scope.edition.file = data.data.file ? data.data.file.id : '';
      $scope.edition.cover = data.data.cover ? data.data.cover.id : '';
      $scope.edition.background = data.data.background ? data.data.background.id : '';
      $scope.edition.status = data.data.status;
      $scope.edition.articles = [];
      angular.forEach(data.data.articles, function (article) {
        var obj = {
          title: article.title,
          subtitle: article.subtitle,
          author_name: article.author_name,
          page_number: article.page_number,
          cover: article.cover ? article.cover.id : '',
          thumb: article.thumb ? article.thumb.id : '',
          cover_url: article.cover ? article.cover.url : '',
          thumb_url: article.thumb ? article.thumb.url : '',
          content: article.content
        };
        obj.tags = [];
        angular.forEach(article.tags, function (tag) {
          obj.tags.push(tag.name);
        });
        $scope.edition.articles.push(obj);
      });
      $scope.edition.cover_url = data.data.cover ? data.data.cover.url : '';
      $scope.edition.background_url = data.data.background ? data.data.background.url : '';
      $scope.edition.file_name = data.data.file ? data.data.file.title : '';
      var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);
      $scope.edition.scheduled_date = scheduled_at.date;
      $scope.edition.scheduled_time = scheduled_at.time;
    });


    $scope.publish = function (data) {
      var obj = {};
      obj.articles = [];

      angular.forEach(data.articles, function (article) {
        obj.articles.push({
          title: article.title,
          subtitle: article.subtitle,
          author_name: article.author_name,
          page_number: article.page_number,
          cover: article.cover,
          thumb: article.thumb,
          tags: article.tags,
          content: article.content,
        });
      });

      obj.background = data.background;
      obj.cover = data.cover;
      obj.number = data.number;
      obj.file = data.file;
      obj.publish_date = data.publish_date;
      obj.theme = data.theme;
      obj.status = data.status;

      if (obj.status == 'scheduled') {
        obj.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;
      }

      PeriodicalService.updateEdition($routeParams.id, $routeParams.edition, obj).then(function (data) {
        NotificationService.success('Edição atualizada com sucesso.');
        $location.path('/periodicals/' + $routeParams.id + '/editions');
      });
    };

    $scope.addArticle = function () {
      var articleModal = $modal.open({
        templateUrl: '/views/article.modal.template.html',
        controller: 'ArticleModalController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          article: function () {
            return false;
          }
        }
      });

      articleModal.result.then(function (data) {
        $scope.edition.articles.push(data);
      });
    };

        $scope.publish = function (data) {
            var obj = {};
            obj.articles = [];

            angular.forEach(data.articles, function (article) {
                obj.articles.push({
                    title: article.title,
                    subtitle: article.subtitle,
                    author_name: article.author_name,
                    page_number: article.page_number,
                    cover: article.cover,
                    thumb: article.thumb,
                    tags: article.tags,
                    content: article.content,
                });
            });

            obj.background = data.background;
            obj.cover = data.cover;
            obj.number = data.number;
            obj.file = data.file;
            obj.publish_date = data.publish_date;
            obj.theme = data.theme;
            obj.status = data.status;

            if (obj.status == 'scheduled') {
                obj.scheduled_at = data.scheduled_date+' '+data.scheduled_time;
            }

            PeriodicalService.updateEdition($routeParams.id, $routeParams.edition, obj).then(function (data) {
                NotificationService.success('Edição atualizada com sucesso.');
                $location.path('/periodicals/'+$routeParams.id+'/editions');
            });
        };

        $scope.addArticle = function () {
            var articleModal = $modal.open({
                templateUrl: 'components/modal/article.modal.template.html',
                controller: 'ArticleModalController',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    article: function () { return false; }
                }
            });

            articleModal.result.then(function (data) {
                $scope.edition.articles.push(data);
            });
        };

        var editArticleModal;

        $scope.editArticle = function (idx, article) {
            editArticleModal = $modal.open({
                templateUrl: 'components/modal/article.modal.template.html',
                controller: 'ArticleModalController',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    article: function () {
                        return article;
                    }
                }
            });

            editArticleModal.result.then(function (data) {
                $scope.edition.articles[idx] = data;
            });
        };

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    $scope.removeArticle = function (idx) {
      $scope.confirmationModal('md', 'Você deseja excluir este artigo?');
      removeConfirmationModal.result.then(function (data) {
        $scope.edition.articles.splice(idx, 1);
      });
    };

    var removeConfirmationModal;
    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $modal.open({
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
    };

    var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
      $scope.modal_title = title;

      $scope.ok = function () {
        $uibModalInstance.close();
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    // Upload
    // Cover Image - Upload

    var watchCover = $scope.$watch('edition_cover', function () {
      if ($scope.edition_cover) {
        $scope.upload([$scope.edition_cover], 'cover');
      }
    });

    var watchBackground = $scope.$watch('edition_background', function () {
      if ($scope.edition_background) {
        $scope.upload([$scope.edition_background], 'background');
      }
    });

    var watchFile = $scope.$watch('edition_file', function () {
      if ($scope.edition_file) {
        $scope.upload([$scope.edition_file], 'pdf');
      }
    });

    $scope.upload = function (files, type) {
      angular.forEach(files, function (file) {
        var obj = {
          title: file.title ? file.title : '',
          description: file.description ? file.description : '',
          altText: file.alt_text ? file.alt_text : '',
          legend: file.legend ? file.legend : ''
        };
        MediaService.newFile(file).then(function (data) {
          if (type == 'cover') {
            $scope.edition.cover = data.id;
            $scope.edition.cover_url = data.url;
          }
          else if (type == 'background') {
            $scope.edition.background = data.id;
            $scope.edition.background_url = data.url;
          }
          else if (type == 'pdf') {
            $scope.edition.file = data.id;
            $scope.edition.file_name = data.title;
          }
        });
      });
    };

    $scope.removeImage = function (type) {
      $timeout(function () {
        if (type == 'cover') {
          $scope.edition.cover = '';
          $scope.edition.cover_url = '';
        }
        else if (type == 'background') {
          $scope.edition.background = '';
          $scope.edition.background_url = '';
        }
        else if (type == 'pdf') {
          $scope.edition.file = '';
          $scope.edition.file_name = '';
        }
        $scope.$apply();
      });
    };
  }
})();
