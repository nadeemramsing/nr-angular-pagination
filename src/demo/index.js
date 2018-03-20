(function () {

    'use strict';

    angular
        .module('Demo', [
            'ngMaterial',
            'NrAngularPagination'
        ])
        .controller('DemoController', DemoController);

    /* @ngInject */
    function DemoController($scope, $http, $httpParamSerializer) {

        var BASEURL = 'http://localhost:4000/api/comments';

        $scope.paginationOptions = {
            'getCount': getCommentsCount,
            'query': { skip: 0, limit: 5 }
        };
        $scope.comments = [];

        $scope.onPageChange = onPageChange;
        $scope.searchComments = searchComments;

        /* INIT */
        getComments({ limit: $scope.paginationOptions.query.limit });

        /* FUNCTION DECLARATIONS */
        function onPageChange(query, operation) {
            if (operation === 'default')
                getComments(query);

            if (operation === 'search')
                searchComments();
        }

        function getComments(query) {
            var qs = qs = $httpParamSerializer(query),
                url = BASEURL + '?' + qs;

            return $http.get(url).then(function (response) {
                $scope.comments = response.data;
            });
        }

        function getCommentsCount(options) {
            if (options.operation === 'search') {
                var qs = qs = $httpParamSerializer($scope.paginationOptions.query),
                    url = BASEURL + '/count' + '?' + qs;

                return $http.get(url).then(function (response) {
                    return response.data.count;
                });
            }

            return $http.get(BASEURL + '/count').then(function (response) {
                return response.data.count;
            });
        }

        function searchComments() {
            getComments($scope.paginationOptions.query)
                .then(function () {
                    $scope.$broadcast('paginationListener', {
                        operation: 'search',
                        reload: true
                    });
                });
        }

    }

})();