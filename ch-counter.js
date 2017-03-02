'use strict';

angular.module('ch-counter', ['ngMaterial']).directive("chCounter", function() {
	return {
        restrict: "E",
        require: "ngModel",
        template: 
        	'<div class="layout-column {{wrapperClass}}" ng-class="{\'flex\': flexible}" ng-style="{\'display\': flexible ? \'inherit\' : \'inline-block\'}" style="min-width: 150px;">' +
        		'<div class="{{labelContClass}} layout-padding no-padding">' +
	        		'<div ng-if="label && (labelDirection == \'left\' || labelDirection == \'top\')" class="layout-row layout-align-center-center {{labelClass}}">' +
	        			'<span ng-bind-html="label"></span>' +
	        		'</div>' +
		        	'<div class="layout-row layout-align-start-center flex">' +
						'<md-button class="{{btnClass}} no-margin" ng-class="!$minusDisabled() ? btnActiveClass : \'\'" aria-label="Minus" ng-disabled="$minusDisabled()" ng-click="minus()">' +
				  			'<md-icon class="mdi mdi-minus md-18"></md-icon>' +
				  		'</md-button>' +
				  		'<div class="layout-column layout-padding layout-align-center-center" ng-class="{\'flex\': flexible}">' +
				  			'<span class="{{countClass}} border-gray-lighter border-radius">{{count || 0}}</span>' +
				  		'</div>' +
				  		'<md-button class="{{btnClass}} no-margin" ng-class="!$plusDisabled() ? btnActiveClass : \'\'" aria-label="Plus" ng-disabled="$plusDisabled()" ng-click="plus()">' +
				  			'<md-icon class="mdi mdi-plus md-18"></md-icon>' +
				  		'</md-button>' +
				  	'</div>' +
				  	'<div ng-if="label && (labelDirection == \'right\' || labelDirection == \'bottom\')" class="layout-row layout-align-center-center {{labelClass}}">' +
				  		'<span ng-bind-html="label"></span>' +
	        		'</div>' +
			  	'</div>' + 			  	
	  		'</div>',
	  	transclude: true,
	  	replace: true,
	  	scope: {
	  		flexible: "=?",
	  		wrapperClass: "@",
	  		btnClass: "@",
	  		btnActiveClass: "@",
        	fieldName: "@",
        	label: "@",
        	labelClass: "@",
        	labelDirection: "@",
        	count: "=ngModel",
        	countClass: "@",
        	fieldName: "@",
        	min: "=?",
        	max: "=?",
        	step: "=?",
        	ngDisabled: "=?",
        	minusDisabled: "=?",
        	plusDisabled: "=?",
    		onMinus: "&?",
    		onPlus: "&?" 			
        },
        link: function (scope, element, attrs, ngModel) {

        	function init() {
	        	scope.btnClass = scope.btnClass || "md-fab md-mini";
	        	scope.btnActiveClass = scope.btnActiveClass || "md-primary";
	        	scope.labelClass = scope.labelClass || "text-gray-light text-small";
	        	        	
	        	scope.count = angular.isNumber(scope.count) ? scope.count : 0;
	        	scope.step = angular.isNumber(scope.step) ? scope.step : 1;
	        	
	        	scope.observeFlexible();
	        	scope.observeLabelDirection();
	        	scope.observeMin();
	        	scope.observeMax();
        	};
        	
        	scope.observeFlexible = function() {
        		scope.flexible = _.isBoolean(scope.flexible) ? scope.flexible : attrs.hasOwnProperty("flexible") && (scope.flexible === undefined || _.isEmpty(scope.flexible) || scope.flexible);
						if (scope.flexible) {
							element.addClass("flex");
						} else {
							element.removeClass("flex");
						}
        	};
        	
        	scope.observeLabelDirection = function() {
        		scope.labelDirection = _.includes(["top", "right", "bottom", "left"], scope.labelDirection) ? scope.labelDirection : "top";
            scope.labelContClass = _.includes(["right", "left"], scope.labelDirection) ? "layout-row" : "layout-column";
        	};
        	
        	scope.observeMin = function() {
        		scope.min = angular.isNumber(scope.min) && (angular.isNumber(scope.max) && scope.min > scope.max) ? scope.max - scope.step : scope.min;
        		
        		if (angular.isNumber(scope.min) && scope.count < scope.min) {
              scope.count = scope.min;
            }
        	};
        	
        	scope.observeMax = function() {
        		scope.max = angular.isNumber(scope.max) && (angular.isNumber(scope.min) && scope.max < scope.min) ? scope.min + scope.step : scope.max;
        		
        		if (angular.isNumber(scope.max) && scope.count > scope.max) {
							scope.count = scope.max;
            }
        	};
        	
        	scope.minus = function(){
        		if(!scope.$minusDisabled()){
        			scope.count = (scope.count || 0) - scope.step;
        			updateModel();
        			scope.onMinus && scope.onMinus();
        		}
        	};
        	
        	scope.plus = function(){
        		if(!scope.$plusDisabled()){
        			scope.count = (scope.count || 0) + scope.step;
        			updateModel();
        			scope.onPlus && scope.onPlus();
        		}
        	};
        	
        	scope.$minusDisabled = function() {
        		return scope.ngDisabled ? scope.ngDisabled : scope.minusDisabled ? scope.minusDisabled : (angular.isNumber(scope.min) && scope.count <= scope.min);
        	};
        	
        	scope.$plusDisabled = function() {
            return scope.ngDisabled ? scope.ngDisabled : scope.plusDisabled ? scope.plusDisabled : (angular.isNumber(scope.max) && scope.count >= scope.max);
        	};
        	
        	function updateModel(){
    			  ngModel.$setViewValue(scope.count);
        	};
        	
        	// init vars
        	init();
        	
        	scope.$watch("flexible", scope.observeFlexible);
        	scope.$watch("labelDirection", scope.observeLabelDirection);
        	scope.$watch("min", scope.observeMin);        	
        	scope.$watch("max", scope.observeMax);
        }
    };  
});
