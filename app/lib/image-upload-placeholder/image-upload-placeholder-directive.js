/**
 * Image placeholder directive.
 * 
 * Use like this: <im-image-upload-placeholder im-image="image" im-delete-permission="note.permissions.editAccess" im-thumb-url="'IPE/keepNotes/noteImage/thumb'"></im-image-upload-placeholder>
 * 
 *
 */


'use strict';

angular.module('GO.ImageUploadPlaceholder', ['ui.bootstrap','GO.core'])

.directive('imImageUploadPlaceholder', ['$templateCache', '$http', 'Utils', 'Model', '$timeout',function($templateCache, $http, Utils, Model, $timeout) {

		
	return {
		restrict: 'E',
		scope: {
			imOnChange: '&?',
			imImageTempAttribute: '=',
			imImageAttribute: '=',
			imReadOnly: '=?',
			imDeletePermission: '=?',
			imThumbParams:'='
		},
		
//		replace:true,

		controller: function($scope, $element, $attrs, $transclude, Utils) { 
			$scope.flowInit = {singleFile:true, target: Utils.url('upload')};
		},
		
		link: function(scope, element, attrs){
			
			// Thumb settings
			if(!attrs.imThumbWidth){
				attrs.imThumbWidth = 150;
			}
			
			if(!attrs.imThumbHeight){
				attrs.imThumbHeight = 150;
			}
			
			if(!attrs.imThumbZoomCrop){
				attrs.imThumbZoomCrop = 1;
			}
						
			if(!attrs.imReadOnly){
				attrs.imReadOnly = false;
			}
			
			// Image settings
			
			if(!attrs.imAlt){
				attrs.imAlt = 'Image';
			}
			
			if(!attrs.imDefaultImageUrl){
				attrs.imDefaultImageUrl = '';
			}
			
			if(angular.isUndefined(scope.imDeletePermission)){
				scope.imDeletePermission = true;
			}						
			
			scope.createOriginalUrl = function(src, fromTmp){

				var defaults = {
					w: null,
					h: null
				};
				angular.extend(defaults, scope.imThumbParams);				
				
				var route = fromTmp ? 'upload/thumb/'+src : attrs.imThumbRoute;
				return Utils.url(route, defaults);
			};
			
			
			
			scope.createThumb = function(src, fromTmp){
				
				var defaults = {
					w: attrs.imThumbWidth,
					h: attrs.imThumbHeight,
					zoomCrop: attrs.imThumbZoomCrop
				};
				
				angular.extend(defaults, scope.imThumbParams);				
								
				var route = fromTmp ? 'upload/thumb/'+src : attrs.imThumbRoute;
				
				return Utils.url(route, defaults);
			};
			
//			var defaultImageUrl = "http://www.placehold.it/"+attrs.imThumbWidth+"x"+attrs.imThumbHeight+"/EFEFEF/AAAAAA&text=no+image";
			
			scope.uploadSuccess = function($file, $message){

				scope.$apply(function(){
					var data = angular.fromJson($message);
					scope.imImageTempAttribute = data.file;				
					scope.imageUrl = scope.createThumb(data.file, true);				
					scope.originalUrl = scope.createOriginalUrl(data.file, true);

					if(scope.imOnChange){
	//					scope.$digest();
						//need to call timeout otherwise the scope model hasn't changed yet !?
						$timeout(function(){
//							scope.$apply(function(){
								scope.imOnChange({file: data.file});
//							}
							
						});
					}
				});

			};

			scope.delete = function($event){
				
				scope.imageUrl = false;
				scope.imImageAttribute = "";	
			};			

			scope.$watch('imImageAttribute',function(newValue, oldValue){			
				
				scope.imageUrl = scope.imImageAttribute ? scope.createThumb(scope.imImageAttribute, false) : false;
				scope.originalUrl = scope.imImageAttribute ?  scope.createOriginalUrl(scope.imImageAttribute, false) : false;
			});
				

		},
		template: '<div class="im-image-upload-placeholder-container" ng-if="imReadOnly">\
		<div class="btn btn-primary enlarge" ng-href="{{originalUrl}}" target="_blank">\
		<span class="fa fa-external-link"></span>\
	</div>\
				<img ng-if="imageUrl" ng-src="{{imageUrl}}" alt="{{imAlt}}" />\
				<i ng-if="!imageUrl" class="fa fa-image"></i>\
</div>\
\
<div class="im-image-upload-placeholder-container dropdown" ng-if="!imReadOnly" \
			data-flow-name="uploader.flow" \
			ng-attr-flow-init="flowInit" \
			data-flow-file-added="!!{png:1,gif:1,jpg:1,jpeg:1}[$file.getExtension()]" \
			data-flow-files-submitted="$flow.upload()" \
			data-flow-file-success="uploadSuccess($file, $message);" \
		>\
\
<ul class="dropdown-menu dropdown-menu-right">\
        <li><div class="im-dropdown-option" flow-btn><span class="fa fa-edit"></span> {{"Select image" | goT}}</div></li>\
		<li><a ng-if="imageUrl" ng-href="{{originalUrl}}" target="_blank"><span class="fa fa-external-link"></span> {{"Show original" | goT}}</a></li>\
		<li><a ng-if="imDeletePermission && imageUrl" ng-click="delete($event);"><span class="fa fa-trash-o"></span> {{"Delete" | goT}}</a></li>\
      </ul>\
	\
	<div data-flow-drop dropdown-toggle>\
				<img class="thumbnail" ng-if="imageUrl" ng-src="{{imageUrl}}" alt="{{imAlt}}" />\
				<div ng-if="!imageUrl" class="thumbnail"><i class="fa fa-image"></i></div>\
			</div>\
\
			<div class="progress-bar-container" ng-repeat="file in $flow.files">\
				<div class="progress progress-striped" ng-class="{active: file.isUploading()}">\
					<div class="progress-bar" role="progressbar"\
						 aria-valuenow="{{file.progress() * 100}}"\
						 aria-valuemin="0"\
						 aria-valuemax="100"\
						 ng-style="{width: (file.progress() * 100) + \'%\'}">\
						<span class="sr-only">{{file.progress()}}% Complete</span>\
					</div>\
				</div>\
			</div>\
		</div>'
	};
}]);
