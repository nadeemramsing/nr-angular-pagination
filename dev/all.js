(function () {

    'use strict';

    PaginationController.$inject = ["$scope"];
    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                options: '=',
                onPageChange: '&',
                onCountChange: '&',
                onLimitChange: '&'
            },
            templateUrl: 'tpl/nr-angular-pagination.html',
            controller: PaginationController,
            controllerAs: 'vm'
        });

    function PaginationController($scope) {
        var vm = this;

        vm.currentPage = 1;
        vm.pages = [];
        vm.totalButtons = 0;

        vm.changeLimit = changeLimit;
        vm.firstPage = firstPage;
        vm.jumpToPage = jumpToPage;
        vm.lastPage = lastPage;
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.show = show;

        /* LOCAL VARIABLES */
        var count = 0,
            operation = 'default';

        /* LISTENER */
        $scope.$on('paginationListener', function (event, args) {
            operation = args.operation;

            if (args.reload)
                getCount();
        });

        this.$onInit = function () {
            handleOptions();
            getCount();
        };

        /* FUNCTION DECLARATIONS */
        function getCount() {
            vm.options.getCount({ operation: operation }).then(function (countArg) {
                count = typeof countArg === 'number' ? countArg : parseInt(countArg);
                getButtons(count);
            });
        }

        function changeLimit() {
            getButtons(count);

            if (vm.currentPage > vm.totalButtons)
                jumpToPage(vm.totalButtons);
            else
                jumpToPage(vm.currentPage);

            vm.onLimitChange({ limit: vm.options.query.limit });
        }

        function getButtons(count) {
            if (count === 0)
                vm.totalButtons = 1;
            else
                vm.totalButtons = ((count + (vm.options.query.limit - 1)) - (count + (vm.options.query.limit - 1)) % (vm.options.query.limit)) / vm.options.query.limit;

            vm.pages.length = 0; //emptying original array

            _.times(vm.totalButtons, function (i) {
                vm.pages.push(i + 1);
            });
        }

        function nextPage() {
            if (vm.currentPage < vm.pages.length)
                vm.currentPage++;

            if ((vm.options.query.skip + vm.options.query.limit) < count) {
                vm.options.query.skip += vm.options.query.limit;
            }
            changePage();
        }

        function prevPage() {
            if (vm.currentPage !== 1)
                vm.currentPage--;

            if ((vm.options.query.skip - vm.options.query.limit) >= 0) {
                vm.options.query.skip -= vm.options.query.limit;
            }
            changePage();
        }

        function firstPage() {
            jumpToPage(1);
        }

        function lastPage() {
            jumpToPage(vm.totalButtons);
        }

        function jumpToPage(pageNum) {
            vm.currentPage = pageNum;
            vm.options.query.skip = (pageNum - 1) * vm.options.query.limit;
            changePage();
        }

        function changePage() {
            vm.onPageChange({ query: vm.options.query, operation: operation });
        }

        var jumper = 20,
            half_jumper = (jumper / 2),
            isBeginning,
            isMiddle,
            isEnd;

        function show(i) {
            isBeginning = vm.currentPage < half_jumper;
            isMiddle = vm.currentPage >= half_jumper && vm.currentPage < (vm.totalButtons - half_jumper);
            isEnd = vm.currentPage >= (vm.totalButtons - half_jumper);

            if (isBeginning)
                if (i < jumper)
                    return true;

            if (isMiddle)
                if (i >= vm.currentPage - half_jumper && i < vm.currentPage + half_jumper)
                    return true;

            if (isEnd)
                if (i >= vm.totalButtons - jumper)
                    return true;
        }

        /* HELPER FUNCTIONS */
        function handleOptions() {
            var requiredOptions = [
                'getCount',
                'query'
            ];

            checkDifference(vm.options, requiredOptions, 'options');

            var requiredQueryOptions = [
                'skip',
                'limit'
            ];

            checkDifference(vm.options.query, requiredQueryOptions, 'options.query');
        }

        function checkDifference(options, requiredOptions, path) {
            var keys = Object.keys(options),
                missingOptions = _.difference(requiredOptions, keys);

            if (missingOptions.length !== 0)
                throw new Error('Required options missing for NrAngularPagination component: ' + missingOptions
                    .map(function (str) { return path + '.' + str })
                    .join(', '));
        }

    }
})();
angular.module('NrAngularPagination').run(['$templateCache', function($templateCache) {$templateCache.put('tpl/nr-angular-pagination.html','<div id="nr-pagination" class="pagination attribution-pagination nr-pagination-wrapper">\r\n    <div layout="row" layout-align="center center">\r\n        <md-select ng-model="vm.data.query.limit" ng-change="vm.changeLimit()" aria-label="change limit">\r\n            <md-option ng-repeat="limit in [25, 50, 100, 500]" ng-value="limit">\r\n                {{limit}}\r\n            </md-option>\r\n        </md-select>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === 1}" ng-click="vm.firstPage()" class="prev">&laquo;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Premi\xE8re page</md-tooltip>\r\n        </ul>\r\n        <br>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === 1}" ng-click="vm.prevPage()" class="prev">&lt;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page pr\xE9c\xE9dente</md-tooltip>\r\n        </ul>\r\n        <ul class="nr-pagination list" ng-repeat="i in vm.pages">\r\n            <li ng-if="vm.show($index)">\r\n                <a ng-class="{active: vm.currentPage === $index+1}" ng-click="vm.jumpToPage(i);">{{i}}</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page {{i}}</md-tooltip>\r\n        </ul>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === vm.pages.length}" ng-click="vm.nextPage()" class="next">&gt;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Page suivante</md-tooltip>\r\n\r\n        </ul>\r\n        <ul class="nr-pagination list">\r\n            <li>\r\n                <a ng-class="{none: vm.currentPage === vm.pages.length}" ng-click="vm.lastPage()" class="next">&raquo;</a>\r\n            </li>\r\n            <md-tooltip md-direction="{{bottom}}" md-delay="750">Derni\xE8re page</md-tooltip>\r\n        </ul>\r\n        <br>\r\n\r\n    </div>\r\n</div>');}]);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".nr-pagination-wrapper {\n" +
"    padding: 10px 0;\n" +
"}\n" +
"\n" +
".nr-pagination {\n" +
"    user-select: none;\n" +
"    list-style: none;\n" +
"    padding: 0;\n" +
"}\n" +
"\n" +
".nr-pagination li {\n" +
"    display: inline;\n" +
"    text-align: center;\n" +
"}\n" +
"\n" +
".nr-pagination a {\n" +
"    float: left;\n" +
"    display: block;\n" +
"    font-size: 14px;\n" +
"    text-decoration: none;\n" +
"    padding: 5px 12px;\n" +
"    color: #212E3B;\n" +
"    margin-left: -1px;\n" +
"    border: 1px solid transparent;\n" +
"    line-height: 1.5;\n" +
"}\n" +
"\n" +
".nr-pagination.list a {\n" +
"    margin-left: 3px;\n" +
"    padding: 0;\n" +
"    width: 30px;\n" +
"    height: 30px;\n" +
"    line-height: 30px;\n" +
"    -moz-border-radius: 100%;\n" +
"    -webkit-border-radius: 100%;\n" +
"    border-radius: 100%;\n" +
"}\n" +
"\n" +
".nr-pagination.list a:hover {\n" +
"    background-color: lightseagreen;\n" +
"    color: #fff;\n" +
"    cursor: pointer;\n" +
"}\n" +
"\n" +
".nr-pagination.list .active {\n" +
"    background-color: lightblue;\n" +
"    border: 2px solid lightseagreen;\n" +
"    pointer-events: none;\n" +
"}\n" +
"\n" +
".nr-pagination.list a.none {\n" +
"    pointer-events: none;\n" +
"    opacity: 0.5;\n" +
"}");
(function () {

    'use strict';

    DemoController.$inject = ["$scope", "$http", "$httpParamSerializer"];
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