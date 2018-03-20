(function () {

    'use strict';

    angular
        .module('NrAngularPagination', [])
        .component('pagination', {
            bindings: {
                options: '=',
                onPageChange: '&',
                onCountChange: '&'
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

        var count = 0,
            operation = '',
            query = {};

        /* LISTENER */
        $scope.$on('pagination-listener', function (event, args) {

        });

        /* $scope.$on('refresh', function (event, args) {
            vm.options.listTotal(args.query).then(function (response) {
                getButtons(parseInt(response.data));
                firstPage();
            })
        });

        $scope.$on("onAdvancedSearchCount", function (event, args) {
            getButtons(args.count);
            query = args.query;
            operation = "advancedsearch";

            if (args.query && args.query.skip === 0) {
                vm.currentPage = 1;
                vm.options.query.skip = 0;
            }

            //init
            if (!args.query.skip)
                vm.options.updateFooter(args.count, null, vm.options.query.limit, true);
        });

        $scope.$on("onSearch", function (event, args) {
            //Scenario for first condition set: After advanced search, displayed query removed.
            if ((args.count && !args.query) || (args.query && args.query.skip === 0) || args.groupMode) {
                vm.currentPage = 1;
                vm.options.query.skip = 0;
            }

            if (args.loadPagination) {
                getButtons(args.count);
                operation = null;
            } else {
                getButtons(args.count);
                operation = "search";
            }
            query = args.query;

            //init
            if (args.loadPagination || (args.query && args.query.skip === 0) || args.groupMode)
                vm.options.updateFooter(args.count, null, vm.options.query.limit, true);
        }); */

        this.$onInit = function () {
            handleOptions();

            if (vm.options) {
                if (vm.options.hasOwnProperty('listTotal')) {
                    vm.options.listTotal(vm.options.query).then(function (count) {
                        count = typeof count === 'number' ? count : parseInt(count);
                        getButtons(count);

                        if (vm.options.hasOwnProperty('updateFooter'))
                            vm.options.updateFooter(count, null, vm.options.query.limit, true);
                    });
                }
            }
        };

        /* FUNCTION DECLARATIONS */
        function changeLimit() {
            getButtons(count);

            if (vm.currentPage > vm.totalButtons)
                jumpToPage(vm.totalButtons);
            else
                jumpToPage(vm.currentPage);

            PropertiesStoreService.changeLimit(vm.options.query.limit)
                .then(function (response) { })
                .catch(function (err) {
                    console.error(err);
                })
        }

        function getButtons(count) {
            if (typeof count === "string" && util.isParsableToNumber(count))
                count = parseInt(count);

            vm.totalButtons = ((count + (vm.options.query.limit - 1)) - (count + (vm.options.query.limit - 1)) % (vm.options.query.limit)) / vm.options.query.limit;

            if (count === 0) {
                vm.totalButtons = 1;
            }

            vm.pages.length = 0;

            for (var i = 1; i <= vm.totalButtons; i++) {
                vm.pages.push(i);
            }

        }

        function nextPage() {
            if (vm.currentPage < vm.pages.length)
                vm.currentPage++;

            if ((vm.options.query.skip + vm.options.query.limit) < count) {
                vm.options.query.skip += vm.options.query.limit;
            }
            emitList();
        }

        function prevPage() {
            if (vm.currentPage !== 1)
                vm.currentPage--;

            if ((vm.options.query.skip - vm.options.query.limit) >= 0) {
                vm.options.query.skip -= vm.options.query.limit;
            }
            emitList();
        }

        function firstPage() {
            jumpToPage(1);
        }

        function lastPage() {
            jumpToPage(vm.totalButtons);
        }

        function jumpToPage(pageNum) {

            if (vm.options.scrollToTop)
                vm.options.scrollToTop();

            vm.currentPage = pageNum;
            vm.options.query.skip = (pageNum - 1) * vm.options.query.limit;
            emitList();
        }

        function emitList() {
            if (query) {
                query.skip = vm.options.query.skip;
                query.limit = vm.options.query.limit;
            }

            if (vm.options.hasOwnProperty('updateFooter')) {
                if (vm.currentPage === vm.pages[vm.pages.length - 1])
                    vm.options.updateFooter(count % vm.options.query.limit, vm.options.query.skip);
                else
                    vm.options.updateFooter(null, vm.options.query.skip, vm.options.query.limit);
            }

            var options = {
                'limit': vm.options.query.limit,
                'skip': vm.options.query.skip,
                'operation': operation || vm.operation,
                'query': query
            };

            //extended behavior to avoid using listeners
            if (vm.options.apiCall) {
                vm.options.apiCall(options);
                return;
            }

            $scope.$emit('refreshList', options);
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
            var options = Object.keys(vm.options),
                requiredOptions = [
                    'getCount',
                    'listTotal',
                    'query'
                ];

            var missingOptions = _.difference(requiredOptions, options);

            if (missingOptions.length !== 0)
                throw new Error('Required options missing for NrAngularPagination component: ' + missingOptions.join(', '));
        }

    }
})();