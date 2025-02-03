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
    $scope.Delete = function () {
        var employeeID = $scope.employeeID;  // Get the employee ID to delete

        // Make an HTTP DELETE request to delete the employee by ID
        $http.delete('/api/Employee/Delete/' + employeeID)
            .success(function (data) {
                if (data > 0) {  // Check if the delete operation was successful
                    alert('Employee with ID ' + employeeID + ' has been deleted.');
                    // Optionally, reset or refresh your UI here
                    $scope.firstName = '';
                    $scope.lastName = '';
                    $scope.Division = '';
                    $scope.Building = '';
                    $scope.Title = '';
                    $scope.Room = '';
                    $scope.employeeID = '';
                    $scope.buttonText = "Create";  // Reset button text to 'Create' after delete
                } else {
                    alert('Failed to delete employee with ID ' + employeeID);
                }
            })
            .error(function (error) {
                alert('Error deleting employee: ' + error);
            });
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