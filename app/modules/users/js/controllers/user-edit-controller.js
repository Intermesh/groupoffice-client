'use strict';

angular.module('GO.controllers').
		controller('UserEditController', ['Model', '$scope', '$state', '$stateParams', 'Store', '$http', 'Utils', 'StoreSelectModal', function (Model, $scope, $state, $stateParams, Store, $http, Utils, StoreSelectModal) {


				$scope.storeSelectModal = new StoreSelectModal(
						new Store('auth/users/'+$stateParams.userId+'/roles',{availableOnly: "1" }),
						'modules/users/partials/multi-select-roles.html',
							function(selected){							
								$scope.user.roles = $scope.user.roles.concat(selected);
							}
						);

				$scope.user.read($stateParams.userId).then(function () {

				});


				$scope.save = function () {
					$scope.user.save()
							.success(function (result) {
								$scope.store.reload();
								$state.go('users.detail', {userId: $scope.user.id});
							});
				};


				$scope.cancel = function () {
					if ($scope.user.id) {

						$scope.user.resetAttributes();

						$state.go('users.detail', {userId: $scope.user.id});
					} else
					{
						$state.go('^');
					}
				};


				$scope.user.fullName = "";

				$scope.changeFullName = function () {

					if($scope.user.fullName){
						var parts = $scope.user.fullName.split(' ');

						$scope.user.contact.firstName = parts.shift();

						if (parts.length > 1) {
							$scope.user.contact.middleName = parts.shift();
						} else
						{
							$scope.user.contact.middleName = "";
						}

						$scope.user.contact.lastName = parts.join(' ');
					}
				};

				$scope.user.showNameParts = false;
			}]);
