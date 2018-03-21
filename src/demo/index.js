(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope, $http, $httpParamSerializer, $q) {

        var BASEURL = 'http://localhost:4000/api/comments';

        $scope.paginationOptions = {
            'getCount': getCommentsCount,
            'query': { skip: 0, limit: 5 }
        };
        $scope.comments = [];

        $scope.onPageChange = onPageChange;
        $scope.searchComments = searchComments;

        /* INIT */
        getComments({ limit: $scope.paginationOptions.query.limit })
            .then(function (response) {
                $scope.comments = response.data;
            });

        /* FUNCTION DECLARATIONS */
        function onPageChange(options) {
            var promises = {};

            promises.getComments = getComments(options.query);

            if (options.reload)
                promises.getCommentsCount = getCommentsCount($scope.paginationOptions.query);

            $q.all(promises).then(function (responses) {
                $scope.comments = responses.getComments.data;

                if (responses.getCommentsCount)
                    $scope.$broadcast('paginationListener', {
                        count: responses.getCommentsCount
                    });
            });
        }

        function searchComments() {
            $scope.$broadcast('paginationListener', {
                operation: 'search',
                reload: true
            });
        }
        
        /* SERVICE */
        function getComments(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '?' + qs;

            return $http.get(url);
        }

        function getCommentsCount(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '/count' + '?' + qs;

            return $http.get(url).then(function (response) {
                return response.data.count;
            });
        }
    }

})();