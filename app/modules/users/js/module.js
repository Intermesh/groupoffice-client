'use strict';


angular.module('GO').
				//Register the app
				config(['modulesProvider', 'settingsProvider', function(modulesProvider, settingsProvider) {
						modulesProvider.addModule('users', 'User management', 'fa-user');
						
						settingsProvider.addPage({
							sref: 'settings.changePassword',
							title: 'Change password',
							icon: 'fa fa-lock'
						});
					}]).
				config(['$stateProvider', function($stateProvider) {

						// Now set up the states
						$stateProvider
										.state('users', {
											url: "/modules/users",
											templateUrl: 'modules/users/partials/main.html',
											controller: 'UsersController'
										})
										.state('users.detail', {
											url: "/users/detail/{userId:[0-9]*}",
											templateUrl: 'modules/users/partials/user-detail.html',
											controller: 'UserDetailController'
										})
										.state('users.edit', {
											url: "/users/edit/{userId:[0-9]*}",
											templateUrl: 'modules/users/partials/user-edit.html',
											controller: 'UserEditController'
										})
										.state("settings.changePassword",{
											url: '/change-password',
											templateUrl: 'modules/users/partials/user-change-password.html',
											controller: 'UserChangePasswordController'
										});
					}]);