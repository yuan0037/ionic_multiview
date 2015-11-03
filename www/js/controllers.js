angular.module('starter.controllers', ['ionic.utils', 'ionic'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

})

.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
        {
            title: 'Shopping List',
            id: 0
        },
        {
            title: 'To Do List',
            id: 1
        },
        {
            title: 'To Sell list',
            id: 2
        }
  ];
})

.controller('SettingsCtrl', function ($scope, $stateParams, $localstorage) {

    $scope.vibrateOnItemComplete = ($localstorage.get('vibrateOnItemComplete') === 'true');
    $scope.notifyWhenListComplete = ($localstorage.get('notifyWhenListComplete')=== 'true');

    $scope.applySettingsForVibration = function () {
        if ($scope.vibrateOnItemComplete === false)
            $scope.vibrateOnItemComplete = true;
        else 
            $scope.vibrateOnItemComplete = false;    
        $localstorage.set('vibrateOnItemComplete', this.vibrateOnItemComplete);
    };
    
    $scope.applySettingsForNotification = function () {
        if ($scope.notifyWhenListComplete === false)
            $scope.notifyWhenListComplete = true;
        else
            $scope.notifyWhenListComplete = false;
        $localstorage.set('notifyWhenListComplete', this.notifyWhenListComplete);

    };
    
})

.controller('PlaylistCtrl', function ($scope, $stateParams, $localstorage, $cordovaVibration, $cordovaLocalNotification) {

    $scope.list_id = $stateParams.playlistId;
    $scope.titleOfList = "";
    if ($scope.list_id === "0") {
        $scope.titleOfList = "Shopping List";
    } else if ($scope.list_id === "1") {
        $scope.titleOfList = "To Do List";
    } else if ($scope.list_id == "2") {
        $scope.titleOfList = "To Sell List";
    }
    
    //------initial values for each list -----
    $scope.initial_list_shopping = [{
        name: "Milk",
        completed: false
    }, {
        name: "Eggs",
        completed: false
    }, {
        name: "Bread",
        completed: false
    }];
    $scope.initial_list_todo = [{
        name: "madd 9135",
        completed: false
    }, {
        name: "enl 8720",
        completed: false
    }, {
        name: "mad 9132",
        completed: false
    }];
    $scope.initial_list_tosell = [{
        name: "Macbook Pro 2014",
        completed: false
    }, {
        name: "iPad 3",
        completed: false
    }, {
        name: "iPhone 5s",
        completed: false
    }];

    //----set up default values for each list if the list is empty when loading---
    $scope.list_shopping = $localstorage.getObject('list_shopping');
    $scope.list_todo = $localstorage.getObject('list_todo');
    $scope.list_tosell = $localstorage.getObject('list_tosell');

    if (Object.keys($scope.list_shopping).length == 0) {
        $scope.list_shopping = $scope.initial_list_shopping;
        $localstorage.setObject('list_shopping', $scope.list_shopping);
    }

    if (Object.keys($scope.list_todo).length == 0) {
        $scope.list_todo = $scope.initial_list_todo;
        $localstorage.setObject('list_todo', $scope.list_todo);
    }

    if (Object.keys($scope.list_tosell).length == 0) {
        $scope.list_tosell = $scope.initial_list_tosell;
        $localstorage.setObject('list_tosell', $scope.list_tosell);
    }

    $scope.current_list = [];
    $scope.newItem = {
        name: "",
        completed: false
    };

    console.log($scope.list_id);
    if ($scope.list_id === "0") {
        $scope.current_list = $scope.list_shopping;
    } else if ($scope.list_id === "1") {
        $scope.current_list = $scope.list_todo;
    } else if ($scope.list_id === "2") {
        $scope.current_list = $scope.list_tosell;
    }


    $scope.addItemForList = function (list_id) {
        $scope.current_list.push($scope.newItem);
        $scope.saveToStorage(list_id);
        $scope.newItem = {
            name: "",
            completed: false
        };
    }
    $scope.removeItem = function (index, list_id) {
        $scope.current_list.splice(index, 1)
        $scope.saveToStorage(list_id);

        $scope.notifyWhenListComplete = $localstorage.get('notifyWhenListComplete');

        if ($scope.notifyWhenListComplete === "true") {
            if ($scope.current_list.length === 0) {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'MultiView yuan0037 Notification',
                    text: $scope.titleOfList + " is empty",
                    data: {
                        customProperty: 'list empty'
                    }
                }).then(function (result) {
                    console.log('1 Notification triggered');
                });
            }
        }
    };

    $scope.markItemDone = function (index, list_id, isDone) {
        $scope.current_list[index].completed = isDone;
        $scope.vibrateOnItemComplete = $localstorage.get('vibrateOnItemComplete');
        if ($scope.vibrateOnItemComplete === "true") {
            $cordovaVibration.vibrate(100);
        }
        $scope.saveToStorage(list_id);
    }
    $scope.saveToStorage = function (list_id) {
        if (list_id === "0") {
            $localstorage.setObject('list_shopping', $scope.current_list);
        } else if (list_id === "1") {
            $localstorage.setObject('list_todo', $scope.current_list);
        } else if (list_id === "2") {
            $localstorage.setObject('list_tosell', $scope.current_list);
        }
    }

});