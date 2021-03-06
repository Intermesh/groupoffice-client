'use strict';

/* Controllers */
angular.module('GO.controllers').
	controller('NoteController', ['$modal', '$scope', '$state', '$timeout', 'Translate', 'Store', 'Model', 'ShareModal', 'MessageBox', 'Utils', function($modal, $scope, $state, $timeout, Translate, Store, Model, ShareModal, MessageBox, Utils) {

			$scope.pageTitle = Translate.t('Notes');

			$scope.contentActive = function() {
				return !$state.is('notes');
			};

			$scope.store = new Store('notes',{returnAttributes: "*,images,listItems,roles,owner"});

			/**
			 * The listeners for drag and drop
			 */
			$scope.dragControlListeners = {
				accept: function(sourceItemHandleScope, destSortableScope) {
					return true; //override to determine drag is allowed or not. default is true.
				},
				itemMoved: function(event) {
//				console.log(event);

				},
				orderChanged: function(event) {
//					$scope.store.saveSortOrder('Intermesh/Notes/Note/saveSort');
				}
			};
			
			// Create the main note model in this scope.
			$scope.note = new Model('notes',{returnAttributes: "*,images,listItems,roles,owner"});
			
			// Set the default color
			$scope.note.color = 'yellow';
		
			//Instantiate Sharing dialog
			$scope.shareModal = new ShareModal(
				[{
					name: 'readAccess',
					label: 'Read'
				}, {
					name: 'editAccess',
					label: 'Edit'
				}, {
					name: 'deleteAccess',
					label: 'Delete'
				}],
			'\\Intermesh\\Modules\\Notes\\Model\\Note'
			);
			
			
			/**
			 * Edit a note
			 * 
			 * @param model note
			 * @returns {undefined}
			 */
			$scope.editNote = function(note) {
				$state.go('notes.edit', {noteId: note.id});
			};
			
			/**
			 * Open the permissions dialog for the note
			 * 
			 * @param model note
			 * @returns {undefined}
			 */
			$scope.openPermissionsDialog = function(note) {

				if (note.currentUserCanManagePermissions) {
					$scope.shareModal.open(note.id);
				}
			};

			/**
			 * Set the color for the note
			 * 
			 * @param model note
			 * @param string color
			 * @param boolean save
			 * @returns {undefined}
			 */
			$scope.setColor = function(note, color, save) {
				
				note.color = color;
				
				if(save)
					note.save();
			};
			
			$scope.afterUpload = function(note) {
				note.save();
			};

			/**
			 * Set a listitem state
			 * 
			 * @param model listItem
			 * @param model note
			 * @param boolean save
			 * @returns {undefined}
			 */
			$scope.listItemClick = function(listItem, note, save) {
				
				listItem.checked = !listItem.checked;
				
				if(save){
					note.save();
				}
				
			};

			/**
			 * Restore a deleted file
			 * 
			 * @param model note
			 * @returns {undefined}
			 */
			$scope.restore = function(note) {
				note.markDeleted = false;
				
				note.unDelete()
					.success(function(result) {
						//success
					})
					.error(function(data) {
						//error
						for (var attributeName in data.model.validationErrors) {
							MessageBox.alert(Translate.t(data.model.validationErrors[attributeName].code));
						}
					});
				
			};

			/**
			 * Delete the selected note
			 * 
			 * @param model note
			 * @returns {undefined}
			 */
			$scope.delete = function(note) {
				
				if (note.permissions.deleteAccess) {
					
					note.markDeleted = true;

					note.delete()
						.success(function(result) {
							//success
						})
						.error(function(data) {
							//error
							for (var attributeName in data.model.validationErrors) {
								MessageBox.alert(Translate.t(data.model.validationErrors[attributeName].code));
							}
						});
				}
			};
		}]);
