var app = angular.module('BiteFinder', []);

// MAIN CONTROLLER
app.controller('MainController', ['$http', '$scope', function($http, $scope){
  // freezing this
  var controller = this;

  // toggle navigation tabs
  this.tab = 1;

  // variables
  this.newUserData = {};
  this.currentUserData = {}; // ng-model data from login form (just UN & PW)
  this.sessionUser = {}; // full user object of the user logged in
  this.sessionActive = false; // boolean variable for toggling session views
  this.userLoginFailed = false;
  this.editingUser = false;
  this.editUserData = {};
  this.newPassword = '';

  // geolocator method to grab user's latitude and longitude
  this.geolocator = function(){
    var success = function(pos){
      controller.newUserData.latitude = pos.coords.latitude;
      controller.newUserData.longitude = pos.coords.longitude;
      return controller.createUser();
    }

    var error = function(){
      // if the user blocks geolocator, it sets default as new york, new york lat/long
      controller.newUserData.latitude = '40.730610';
      controller.newUserData.longitude = '-73.935242';
      return controller.createUser();
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  // ajax request to create a new user
  this.createUser = function(){
    // http request to create the user
    var tempPassword = controller.newUserData.password
    $http({
      method:'POST',
      url: '/users',
      data: controller.newUserData
    }).then(function(response){
      controller.newUserData = {}; // empties the array after the user is created
      controller.currentUserData.username = response.data.username;
      controller.currentUserData.password = tempPassword;
      controller.tab = 2;
      controller.loginCheck();
    }, function(error){
        console.log(error);
    });
  };

  // Check Login username/password info
  this.loginCheck = function(){
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        username: controller.currentUserData.username,
        password: controller.currentUserData.password
      }
    }).then(function(response){
      if (response.data === 'failed'){
        controller.userLoginFailed = true;
        console.log('Username/Password not match');
      } else {
        controller.tab = 1;
        controller.sessionUser = response.data;
        controller.userLoginFailed = false;
        controller.sessionActive = true;
        $scope.$$childTail.zomato.defaultLocationSearch();
      }
    }, function(){
      console.log('Failed in login check');
    });
  };

  // Logout
  this.logOut = function(){
    $http({
      method: 'DELETE',
      url: '/sessions'
    }).then(function(response){
      controller.sessionUser = {};
      controller.currentUserData = {};
      $scope.$$childTail.zomato.defaultLocation = false;
      $scope.$$childTail.zomato.isViewGalleryActive = false;
      controller.sessionActive = false;
      controller.tab = 1;
      // send to landing page
    }, function(){
      console.log('Failed in log out');
    });
  };

  // Edit User HTTP PUT request
  this.editUser = function(){
    this.editingUser = true;
    this.editUserData = {
      username: controller.sessionUser.username,
      password: controller.sessionUser.password,
      name: controller.sessionUser.name,
      city: controller.sessionUser.city
    }
  };

  // Cancel Edit User
  this.cancelEditUser = function(){
    //console.log('Cancel Edit Session:', controller.sessionUser);
    //console.log('Cancel Edit Edit:', controller.editUserData);
    this.editingUser = false;
    this.editUserData = {};
  };

  // Edits user
  this.updateUser = function(){
    //console.log('Update User ', controller.editUserData);
    if (controller.newPassword !== '') {
      controller.submitUserData = {
        username: controller.editUserData.username,
        password: controller.newPassword,
        name: controller.editUserData.name,
        city: controller.editUserData.city,
        profilePic: controller.editUserData.profilePic
      }
    } else {
      controller.submitUserData = {
        username: controller.editUserData.username,
        name: controller.editUserData.name,
        city: controller.editUserData.city,
        profilePic: controller.editUserData.profilePic
      }
    }
    $http({
      method: 'PUT',
      url: '/users/' + controller.sessionUser._id,
     data: controller.submitUserData
   }).then(function(response){
      console.log(response.data);
      controller.editingUser = false;
      controller.sessionUser = {
        username: response.data.username,
        password: response.data.password,
        name: response.data.name,
        city: response.data.city,
        profilePic: response.data.profilePic,
        _id: response.data._id,
        favorites: response.data.favorites,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        savedLoc: response.data.savedLoc
      };
      console.log(controller.sessionUser);
   }, function(){
     console.log('Failed in update user');
   })
  };

  // Delete User HTTP DELETE request
  this.deleteUser = function(){
    $http({
      method: 'DELETE',
      url: '/users/' + controller.sessionUser._id
    }).then(function(response){
      controller.logOut(); // When profile is deleted, Log Out of the current session
      controller.sessionUser = {}; // and clear the controller var of the session user's info
    }, function(){
      console.log('failed to delete user');
    });
  }
}]);

// ZOMATO API CONTROLLER
app.controller('ZomatoController', ['$http', '$scope', function($http, $scope){
  // freezing this
  var controller = this;

  // variables
  this.locationSuggestions = [];
  this.foundRestaurants = [];
  this.isViewLocationResultsActive = false;
  this.isViewGalleryActive = false;
  this.isViewRestaurantActive = false;
  this.viewRestaurantInd = null;
  this.userReview = {};
  this.cuisineSearch = "all";
  this.activeLocationId = '';
  this.saveRestaurantSuccess = false;

  // searches for restauruants within a location via long/lat
  this.longLat = function(){
    $http({
      method: 'GET',
      url: '/zomato/' + $scope.$parent.main.sessionUser.latitude + '/' + $scope.$parent.main.sessionUser.longitude
    }).then(function(response){
        controller.activeLocationId = response.data.location.city_id;
        controller.isViewGalleryActive = true;
        controller.foundRestaurants = response.data.nearby_restaurants;
        controller.locationName = response.data.location.city_name;
    }, function(){
        console.log('error');
    })
  };

  // searches for a list of cities via a string query
  this.searchCities = function(){
    $http({
      method: 'GET',
      url: '/zomato/' + controller.cityInput
    }).then(function(response){
        if (response.data.location_suggestions.length > 0){
          controller.locationSuggestions = response.data.location_suggestions;
          controller.isViewLocationResultsActive = true;
          controller.noCities = false;
        } else {
            controller.isViewLocationResultsActive = true;
            controller.noCities = true;
        }
    }, function(){
        console.log(error);
    })
  };

  // searches for a list of restaurants within a city by city ID
  this.findRestaurants = function(id){
    $http({
      method: "GET",
      url: "/zomato/restaurants/" + id
    }).then(function(response){
      controller.locationName = response.data.restaurants[0].restaurant.location.city;
      controller.foundRestaurants = response.data.restaurants;
      controller.regularSearch = true;
      controller.isViewGalleryActive = true;
      controller.defaultLocation = false;
      controller.activeLocationId = id;
      controller.cuisineSearch = 'all';
    }, function(error){
      console.log(error);
    })
  };

  // searches for a list of restaurants in a pre-defined area by their cuisine type
  this.findRestaurantsByCuisine = function(){
    if (this.cuisineSearch === 'all') {
      this.findRestaurants(controller.activeLocationId);
    } else {
      $http({
        method: "GET",
        url: "/zomato/restaurants/" + controller.activeLocationId + "/cuisine/" + controller.cuisineSearch
      }).then(function(response){
        controller.foundRestaurants = response.data.restaurants;
        console.log(response);
        console.log(controller.foundRestaurants);
      }, function(error){
        console.log(error);
      });
    }
  }

  // saves a restaurant to a user's favorites
  this.saveRestaurant = function(){
    if($scope.$parent.main.sessionActive){
      // add to session list to display in real time
      $scope.$parent.main.sessionUser.favorites.push(controller.restaurantDetail);
      // make http request to add to database favorites
      $http({
        method:'PUT',
        url:'/users/favorites/' + $scope.$parent.main.sessionUser._id,
        data: controller.restaurantDetail
      }).then(function(response){
        controller.saveRestaurantSuccess = true;
        console.log(response);
      }, function(error){
          console.log(error);
      })
    } else {
        console.log('not logged in');
    }
  };

  // remove a restaurant from a user's favorites
  this.deleteRestaurant = function(){
    if ($scope.$parent.main.sessionActive){
      // remove reviews associated with this restaurant
      $http({
        method: 'DELETE',
        url: '/review/' + $scope.$parent.main.sessionUser._id + '/' + controller.restaurantDetail.id
      }).then(function(response){
        //console.log(response);
      }, function(){
          console.log('Failed in removing favorite restaurant');
      });

      // remove from session list
      $scope.$parent.main.sessionUser.favorites.splice(controller.viewRestaurantInd,1);
      $http({
        method: 'DELETE',
        url: '/users/favorites/' + $scope.$parent.main.sessionUser._id + '/' + controller.restaurantDetail.id
      }).then(function(response){
        //console.log(response);
        controller.isViewRestaurantActive = false;
      }, function(){
          console.log('Failed in removing favorite restaurant');
      });
    } else {
      console.log('not logged in');
    }
  };

  // shows restaurant detail modal
  this.showRestaurantDetail = function(ind){
    this.isFavoriteRestaurant = false;
    this.isViewRestaurantActive = true;
    this.restaurantDetail = controller.foundRestaurants[ind].restaurant;
    if (this.restaurantDetail.featured_image === ''){
      this.restaurantDetail.featured_image = "/img/defaultrestaurant.png";
    }
  };

  // hides the restaurant detail modal
  this.closeRestaurantDetail = function(){
    this.isViewRestaurantActive = false;
    this.saveRestaurantSuccess = false;
  };

  // shows restaurant detail modal of favorite restaurants
  this.showFavoriteRestaurantDetail = function(ind){
    this.isViewRestaurantActive = true;
    this.isFavoriteRestaurant = true;
    this.viewRestaurantInd = ind;
    this.restaurantDetail = $scope.$parent.main.sessionUser.favorites[ind];
    // this.restaurantDetail.isFavoriteRestaurant = true;
    console.log($scope.$parent.main.sessionUser.favorites);
    console.log(this.restaurantDetail);
    console.log(ind);
    //console.log(this.restaurantDetail);
    // console.log('user id ', $scope.$parent.main.sessionUser._id);
    // console.log('restaurant id ', this.restaurantDetail.id);
    $http({
      method: "GET",
      url: "/review/"+ $scope.$parent.main.sessionUser._id +"/" + this.restaurantDetail.id
    }).then(function(response){
      console.log('Review ', response.data);
      controller.userReview = response.data;
      //console.log(controller.foundReview);
    }, function(error){
      console.log(error);
    })
  };
  // save or update user review
  this.saveReview = function(id){
    if (id === undefined || id === null){
      // create the user review
      //console.log(controller.userReview.comments);
      $http({
        method: 'POST',
        url: '/review',
        data: {
          userId: $scope.$parent.main.sessionUser._id,
          restaurantId: controller.restaurantDetail.id,
          comments: controller.userReview.comments
        }
      }).then(function(response){
        console.log('New Review ' ,response.data);
        controller.userReview._id = response.data._id;
      }, function(err){
        console.log('Failed in creating new user review');
      });

    } else {
      console.log('Update Review ' + id);
      // textarea is null
      if ( this.userReview.comments === '') {
        //console.log('Update review null ');
        // delete from db
        $http({
          method: 'DELETE',
          url: '/review/id/' + id
        }).then(function(response){
          console.log('Delete Review ' ,response.data);
          controller.userReview._id = null;
        }, function(err){
          console.log('Failed in deleting a user review');
        });
      } else {
        // update db
        $http({
          method: 'PUT',
          url: '/review/' + id,
          data: {
            comments: controller.userReview.comments
          }
        }).then(function(response){
          console.log('Updated Review ' ,response.data);
        }, function(err){
          console.log('Failed in updating a user review');
        });
      }
    }
  };


  // saves a location (name and id) into local database by creating an object
  this.saveLocation = function(location){
    if ($scope.$parent.main.sessionActive){ // checks if a user is logged in first
      $http({
        method: 'POST',
        url: '/locations/save',
        data: {
          name: location.name,
          cityId: location.id,
          user: $scope.$parent.main.sessionUser._id
        }
      }).then(function(response){
          $scope.$parent.main.sessionUser.savedLoc = response.data.savedLoc;
      }, function(error){
          console.log(error);
      });
    } else {
        console.log('not logged in!');
    }
  };

  // deletes a user's saved location
  this.deleteLocation = function(location){
    if($scope.$parent.main.sessionActive){
      $http({
        method:'DELETE',
        url:'/locations/delete/' + location._id + '/' + location.cityId,
      }).then(function(response){
          $scope.$parent.main.sessionUser.savedLoc = response.data.savedLoc
      }, function(error){
          console.log(error);
      })
    } else {
        console.log('not logged in!');
    }
  }

  // calls longLat function if user logged in successfully
  this.defaultLocationSearch = function(){
    if($scope.$parent.main.sessionActive){
      this.longLat();
      this.defaultLocation = true;
    } else {
        console.log('couldn\'t log in!');
    }
  }
}]);
