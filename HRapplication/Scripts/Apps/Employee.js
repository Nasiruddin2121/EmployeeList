//Controller
App.controller('EmployeeListCtrl', function ($scope, $http) {

    

    //Clear All
    $scope.ClearAll = function () {
        $scope.firstName = " ";
        $scope.lastName = "";
        $scope.Division = "";
        $scope.Building = "";
        $scope.Title = "";
        $scope.Room = "";
        $scope.buttonText = 'Save';
    }
    //End of Clear All

    ////Search
    $scope.Search = function () {
        $http.get('/api/Employee/GetByID/' + $scope.employeeID).success(function (data) {
            if (data != null) {
                $scope.firstName = data.firstName;
                $scope.lastName = data.lastName;
                $scope.Division = data.Division;
                $scope.Building = data.Building;
                $scope.Title = data.Title;
                $scope.Room = data.Room;
                $scope.buttonText = "Update";
            }
            else {
                alert('ID ' + $scope.employeeID + ' is not found.');
            }
        });
    }
    
    $scope.Save = function () {
        alert(2);
                var entity = {
                    firstName: $scope.firstName,
                    lastName: $scope.lastName,
                    Division: $scope.Division,
                    Building: $scope.Building,
                    Title: $scope.Title,
                    Room: $scope.Room,
                }
                $http.post('/api/Employee/Add', entity).success(function (data) {
                    if (data == 1) {
                        alert(' already exist');
                        $scope.ClearAll();
                    }
                    else {
                        alert('Data Saved Successfully');
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, 1);
                        $scope.ClearAll();

                    }
                });
            }

    $scope.Update = function () {
        alert($scope.employeeID);
        var entity = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            Division: $scope.Division,
            Building: $scope.Building,
            Title: $scope.Title,
            Room: $scope.Room
        };

        $http.put('/api/Employee/Update/' + $scope.employeeID, entity)
            .then(function (response) {
                alert('Data updated successfully');
                // Handle the successful update
            })
            .catch(function (error) {
                alert('Error: ' + error.message);
                // Handle error
            });
    };

    // Start ng-Grid-2
    $scope.filterOptions = {
        finterText: "",
        useExternalFinter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 15, 20],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('/api/Bank/GetAll').success(function (largeLoad) {
                    data = largeLoad.filter(function (item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                });
            }
            else {
                $http.get('/api/Bank/GetAll').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad, page, pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal != oldVal && newVal.currentPage != oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.PartyItemsgridOption = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        enableCellSelection: true,
        selectedIems: $scope.selectedRow,
        multiSelect: false,
        columnDefs:
         [
            { field: 'Edit', width: 40, cellTemplate: '<button ng-click=edit(row.entity); style="margin-left:10px"><img src=../Images/edit.gif /></button>' },
            { field: 'Delete', width: 65, cellTemplate: '<button ng-click=delete(row.entity)><img src=../Images/delete.gif /></button>', visible: false },
            { field: 'BankID', displayName: 'Bank ID', width: 120, visible: false },
            { field: 'BankName', displayName: 'Bank Name', enableCellEdit: true, width: 450 },
            { field: 'CompanyID', displayName: 'Company ID', enableCellEdit: true, width: 400, visible: false },
            { field: 'Note', displayName: 'Note', enableCellEdit: true, width: 550 },
            { field: 'Creator', displayName: 'Creator', enableCellEdit: true, width: 150, visible: false },
            { field: 'CreationDate', displayName: 'Creation Date', enableCellEdit: true, width: 120, cellFilter: 'date:\'dd/MM/yyyy\'', visible: false }
         ]
    };
    //End ng-Grid-2
    $scope.edit = function (row) {
        $http.get('/api/Employee/GetByID/' + row.employeeID).success(function (data) {
            if (data != null) {
                $scope.firstName = data.firstName;
                $scope.lastName = data.lastName;
                $scope.Division = data.Division;
                $scope.Building = data.Building;
                $scope.Title = data.Title;
                $scope.Room = data.Room;
                $scope.buttonText = "Update";
            }
        });
    }

});