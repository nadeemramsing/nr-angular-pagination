(function () {

    'use strict';

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
            operation = '',
            query = {};

        /* LISTENER */
        $scope.$on('paginationListener', function (event, args) {

        });

        this.$onInit = function () {
            handleOptions();
            getCount();
        };

        /* FUNCTION DECLARATIONS */
        function getCount() {
            vm.options.getCount(vm.options.query).then(function (countArg) {
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
            vm.onPageChange({ query: vm.options.query });
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