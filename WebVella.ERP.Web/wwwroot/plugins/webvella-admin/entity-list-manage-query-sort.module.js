﻿/* entity-lists.module.js */

/**
* @desc this module manages the entity record lists in the admin screen
*/

(function () {
	'use strict';

	angular
        .module('webvellaAdmin') //only gets the module, already initialized in the base.module of the plugin. The lack of dependency [] makes the difference.
        .config(config)
		.controller('DeleteListModalController', deleteListModalController)
        .controller('WebVellaAdminEntityListManageQuerySortController', controller);

	// Configuration ///////////////////////////////////
	config.$inject = ['$stateProvider'];

	
	function config($stateProvider) {
		$stateProvider.state('webvella-admin-entity-list-manage-query-sort', {
			parent: 'webvella-admin-base',
			url: '/entities/:entityName/lists/:listName/query-sort', //  /desktop/areas after the parent state is prepended
			views: {
				"topnavView": {
					controller: 'WebVellaAdminTopnavController',
					templateUrl: '/plugins/webvella-admin/topnav.view.html',
					controllerAs: 'topnavData'
				},
				"sidebarView": {
					controller: 'WebVellaAdminSidebarController',
					templateUrl: '/plugins/webvella-admin/sidebar.view.html',
					controllerAs: 'sidebarData'
				},
				"contentView": {
					controller: 'WebVellaAdminEntityListManageQuerySortController',
					templateUrl: '/plugins/webvella-admin/entity-list-manage-query-sort.view.html',
					controllerAs: 'ngCtrl'
				}
			},
			resolve: {
				resolvedCurrentEntityMeta: resolveCurrentEntityMeta,
				resolvedViewLibrary: resolveViewLibrary,
				resolvedCurrentEntityList: resolveCurrentEntityList,
				resolvedEntityRelationsList: resolveEntityRelationsList,
			},
			data: {

			}
		});
	};


	//#region << Resolve Functions >>/////////////////////////

	resolveCurrentEntityMeta.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveCurrentEntityMeta($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {
		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityMeta($stateParams.entityName, successCallback, errorCallback);

		return defer.promise;
	}

	resolveCurrentEntityList.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveCurrentEntityList($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {

		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityList($stateParams.listName, $stateParams.entityName, successCallback, errorCallback);

		return defer.promise;
	}

	resolveViewLibrary.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveViewLibrary($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {

		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getEntityViewLibrary($stateParams.entityName, successCallback, errorCallback);
		return defer.promise;
	}

	resolveEntityRelationsList.$inject = ['$q', '$log', 'webvellaCoreService', '$stateParams', '$state', '$timeout'];
	
	function resolveEntityRelationsList($q, $log, webvellaCoreService, $stateParams, $state, $timeout) {

		// Initialize
		var defer = $q.defer();

		// Process
		function successCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.resolve(response.object);
			}
		}

		function errorCallback(response) {
			if (response.object == null) {
				$timeout(function () {
					alert("error in response!")
				}, 0);
			}
			else {
				defer.reject(response.message);
			}
		}

		webvellaCoreService.getRelationsList(successCallback, errorCallback);

		return defer.promise;
	}
	//#endregion

	//#region << Controller >> ///////////////////////////////
	controller.$inject = ['$scope', '$log', '$rootScope', '$state', '$timeout', 'ngToast', 'pageTitle', 'resolvedCurrentEntityMeta', '$uibModal', 'resolvedCurrentEntityList',
						'resolvedViewLibrary', 'webvellaCoreService', 'resolvedEntityRelationsList'];
	
	function controller($scope, $log, $rootScope, $state, $timeout, ngToast, pageTitle, resolvedCurrentEntityMeta, $uibModal, resolvedCurrentEntityList,
						resolvedViewLibrary, webvellaCoreService, resolvedEntityRelationsList) {

		
		var ngCtrl = this;
		ngCtrl.entity = resolvedCurrentEntityMeta;

		//#region << Update page title & hide the side menu >>
		ngCtrl.pageTitle = "Entity Details | " + pageTitle;
		$timeout(function(){
			$rootScope.$emit("application-pageTitle-update", ngCtrl.pageTitle);
			//Hide Sidemenu
			$rootScope.$emit("application-body-sidebar-menu-isVisible-update", false);
		},0);

		$rootScope.adminSectionName = "Entities";
		$rootScope.adminSubSectionName = ngCtrl.entity.label;
		//#endregion

		//#region << Query comparison options >>
		ngCtrl.allQueryComparisonList = [
			{
				key: "EQ",
				value: "is equal to"
			},
			{
				key: "NOT",
				value: "is not equal to"
			},
			{
				key: "LT",
				value: "is less than"
			},
			{
				key: "LTE",
				value: "is less than or equal"
			},
			{
				key: "GT",
				value: "is greater than"
			},
			{
				key: "GTE",
				value: "is greater than or equal"
			},
			{
				key: "CONTAINS",
				value: "contains"
			},
			{
				key: "NOTCONTAINS",
				value: "does not contain"
			},
			{
				key: "STARTSWITH",
				value: "starts with"
			},
			{
				key: "NOTSTARTSWITH",
				value: "does not start with"
			}
		];

		ngCtrl.basicQueryComparisonList = [
			{
				key: "EQ",
				value: "is equal to"
			},
			{
				key: "NOT",
				value: "is not equal to"
			}
		];

		ngCtrl.getQueryComparisonOptionsList = function (query) {
			var field = {};
			for (var i = 0; i < ngCtrl.library.items.length; i++) {
				if (ngCtrl.library.items[i].fieldName == query.fieldName) {
					field = ngCtrl.library.items[i];
				}
			}
			if (isEmpty(field)) {
				return ngCtrl.allQueryComparisonList;
			}
			else {
				switch (field.meta.fieldType) {
					case 11:
						return ngCtrl.basicQueryComparisonList;
					case 21:
						return ngCtrl.basicQueryComparisonList;
					default:
						return ngCtrl.allQueryComparisonList;
				}
			}

		}
		//#endregion

 		//#region << Initialize the list >>
		ngCtrl.list = fastCopy(resolvedCurrentEntityList);
		ngCtrl.relationsList = fastCopy(resolvedEntityRelationsList);

		ngCtrl.defaultFieldName = null;
		function calculateDefaultSearchFieldName() {
			var name = null;
			for (var k = 0; k < ngCtrl.list.columns.length; k++) {
				if (ngCtrl.list.columns[k].type === "field") {
					name = ngCtrl.list.columns[k].meta.name;
					break;
				}
			}
			ngCtrl.defaultFieldName = name;
		}
		calculateDefaultSearchFieldName();

		function patchFieldSuccessCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			webvellaCoreService.regenerateAllAreaAttachments();
		}

		function patchSuccessCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			ngCtrl.list = response.object;
			ngCtrl.generateAlreadyUsed();
		}
		function patchErrorCallback(response) {
			ngToast.create({
				className: 'error',
				content: '<span class="go-red">Error:</span> ' + response.message,
				timeout: 7000
			});
		}

		ngCtrl.updateQuery = function () {
			$timeout(function () {
				var postObj = {};
				postObj.query = fastCopy(ngCtrl.list.query);
				webvellaCoreService.patchEntityList(postObj, ngCtrl.list.name, ngCtrl.entity.name, patchSuccessCallback, patchErrorCallback)
			}, 1);
		}

		ngCtrl.updateSorts = function () {
			var postObj = {};
			postObj.sorts = ngCtrl.list.sorts;
			webvellaCoreService.patchEntityList(postObj, ngCtrl.list.name, ngCtrl.entity.name, patchSuccessCallback, patchErrorCallback)
		}

		//#endregion

		//#region << Initialize the library >>

		//Generate already used
		var alreadyUsedItemDataNames = [];
		ngCtrl.generateAlreadyUsed = function () {
			alreadyUsedItemDataNames = [];
			for (var i = 0; i < ngCtrl.list.columns.length; i++) {
				if (ngCtrl.list.columns[i].meta) {
					alreadyUsedItemDataNames.push(ngCtrl.list.columns[i].dataName);
				}
			}
		}
		ngCtrl.generateAlreadyUsed();
		ngCtrl.fullLibrary = {};
		ngCtrl.fullLibrary.items = fastCopy(resolvedViewLibrary);
		//Fields list eligable to be options in the sort and query dropdowns
		ngCtrl.onlyFieldsLibrary = {};
		ngCtrl.onlyFieldsLibrary.items = [];
		ngCtrl.library = {};
		ngCtrl.library.relations = [];
		ngCtrl.library.items = [];

		ngCtrl.sortLibrary = function () {
			ngCtrl.library.items = ngCtrl.library.items.sort(function (a, b) {
				if (a.fieldName < b.fieldName) return -1;
				if (a.fieldName > b.fieldName) return 1;
				return 0;
			});
		}
		ngCtrl.sortOnlyFieldsLibrary = function () {
			ngCtrl.onlyFieldsLibrary.items = ngCtrl.onlyFieldsLibrary.items.sort(function (a, b) {
				if (a.fieldName < b.fieldName) return -1;
				if (a.fieldName > b.fieldName) return 1;
				return 0;
			});
		}
		ngCtrl.checkIfRelationAddedToLibrary = function (relationName) {
			if (ngCtrl.library.relations.length > 0) {
				for (var i = 0; i < ngCtrl.library.relations.length; i++) {
					if (ngCtrl.library.relations[i].relationName === relationName && ngCtrl.library.relations[i].addedToLibrary) {
						return true;
					}
				}
				return false;
			}
			else {
				return false;
			}
		}


		ngCtrl.generateLibrary = function (generateRelationOptions) {
			ngCtrl.library.items = [];
			ngCtrl.onlyFieldsLibrary = {};
			ngCtrl.onlyFieldsLibrary.items = [];
			if (generateRelationOptions) {
				ngCtrl.library.relations = [];
			}
			ngCtrl.fullLibrary.items.forEach(function (item) {
				if ((item.meta && alreadyUsedItemDataNames.indexOf(item.dataName) == -1) || !item.meta) {
					switch (item.type) {
						case "field":
							ngCtrl.library.items.push(item);
							break;
						case "relationOptions":
							if (generateRelationOptions) {
								item.addedToLibrary = false;
								item.sameOriginTargetEntity = false;
								for (var r = 0; r < ngCtrl.relationsList.length; r++) {
									if (item.relationName == ngCtrl.relationsList[r].name && ngCtrl.relationsList[r].originEntityId == ngCtrl.relationsList[r].targetEntityId) {
										item.sameOriginTargetEntity = true;
									}
								}
								ngCtrl.library.relations.push(item);
							}
							break;
						case "view":
							ngCtrl.library.items.push(item);
							break;
						case "list":
							if (item.listId != ngCtrl.list.id) {
								ngCtrl.library.items.push(item);
							}
							break;
						case "fieldFromRelation":
							if(ngCtrl.checkIfRelationAddedToLibrary(item.relationName)){
								ngCtrl.library.items.push(item);
							}
							break;
						case "viewFromRelation":
							if(ngCtrl.checkIfRelationAddedToLibrary(item.relationName)){
								ngCtrl.library.items.push(item);
							}
							break;
						case "listFromRelation":
							if(ngCtrl.checkIfRelationAddedToLibrary(item.relationName)){
								ngCtrl.library.items.push(item);
							}
							break;
						case "treeFromRelation":
							if(ngCtrl.checkIfRelationAddedToLibrary(item.relationName)){
								ngCtrl.library.items.push(item);
							}
							break;
					}
				}
				if (item.type == "field") {
					ngCtrl.onlyFieldsLibrary.items.push(item);
				}
			});
			ngCtrl.sortLibrary();
			ngCtrl.sortOnlyFieldsLibrary();
		}

		ngCtrl.generateLibrary(true);

		//Extract the direction change information from the list if present
		for (var k = 0; k < ngCtrl.list.relationOptions.length; k++) {
			for (var m = 0; m < ngCtrl.library.relations.length; m++) {
				if (ngCtrl.list.relationOptions[k].relationName == ngCtrl.library.relations[m].relationName) {
					ngCtrl.library.relations[m].direction = ngCtrl.list.relationOptions[k].direction;
				}

			}

		}

		ngCtrl.library.relations = ngCtrl.library.relations.sort(function (a, b) {
			if (a.relationName < b.relationName) return -1;
			if (a.relationName > b.relationName) return 1;
			return 0;
		});


		//#endregion

		//#region << Regenerate library >>
		ngCtrl.regenerateLibrary = function () {
			ngCtrl.generateAlreadyUsed();
			ngCtrl.generateLibrary(false);
		}

		//#endregion	

		//#region << Logic >>

		//#region << Query & Sort>>
		ngCtrl.manageQueryDataLink = function(selectedQuery){
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'manageDataLinkModal.html',
				controller: 'ManageDataLinkModalController',
				controllerAs: "popupCtrl",
				size: "lg",
				resolve: {}
			});
		}


		//Used in the directives
		function findInTreeById(startElement, matchingId) {
			if (startElement.id == matchingId) {
				return startElement;
			} else if (startElement.subQueries != null) {
				var result = null;
				for (i = 0; result == null && i < startElement.subQueries.length; i++) {
					result = searchTree(startElement.subQueries[i], matchingId);
				}
				return result;
			}
			return null;
		}
		function deleteInTreeById(startElement, matchingId) {
			if (startElement.id == matchingId) {
				return startElement;
			} else if (startElement.subQueries != null) {
				var result = null;
				for (i = 0; result == null && i < startElement.subQueries.length; i++) {
					result = searchTree(startElement.subQueries[i], matchingId);
				}
				return result;
			}
			return null;
		}
		ngCtrl.getIncludeFile = function (query) {
			switch (query.queryType) {
				case "EQ":
					return 'queryRule.html';
				case "NOT":
					return 'queryRule.html';
				case "LT":
					return 'queryRule.html';
				case "LTE":
					return 'queryRule.html';
				case "GT":
					return 'queryRule.html';
				case "GTE":
					return 'queryRule.html';
				case "CONTAINS":
					return 'queryRule.html';
				case "STARTSWITH":
					return 'queryRule.html';
				case "AND":
					return 'querySection.html';
				case "OR":
					return 'querySection.html';
			}
		}
		ngCtrl.AddRule = function (query) {
			var subquery = {
				"queryType": "EQ",
				"fieldName": "id",
				"fieldValue": "",
				"subQueries": []
			};
			query.subQueries.push(subquery);
			ngCtrl.updateQuery();
		}
		ngCtrl.AddSection = function (query) {
			var subquery = {
				"queryType": "AND",
				"fieldName": null,
				"fieldValue": null,
				"subQueries": [
					{
						"queryType": "EQ",
						"fieldName": "id",
						"fieldValue": "",
						"subQueries": []
					}
				]
			};
			if (query != null) {
				query.subQueries.push(subquery);
			}
			else {
				ngCtrl.list.query = subquery;
			}
			ngCtrl.updateQuery();
		}
		ngCtrl.DeleteItem = function (parent, index) {
			if (parent != null) {
				parent.subQueries.splice(index, 1);
			}
			else {
				ngCtrl.list.query = {};
				ngCtrl.list.query = null;
			}
			ngCtrl.updateQuery();
		}
		ngCtrl.DeleteSortRule = function (index) {
			ngCtrl.list.sorts.splice(index, 1);
			if (ngCtrl.list.sorts.length == 0) {
				ngCtrl.list.sorts = null;
			}
			ngCtrl.updateSorts();
		}
		ngCtrl.AddSortRule = function () {
			if (ngCtrl.list.sorts == null) {
				ngCtrl.list.sorts = [];
			}
			var subrule = {
				"fieldName": "id",
				"sortType": "ascending"
			};
			ngCtrl.list.sorts.push(subrule);
			ngCtrl.updateSorts();
		}
		//#endregion
		
		//#endregion

		//#region << Modals >>
		ngCtrl.deleteListModal = function () {
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'deleteListModal.html',
				controller: 'DeleteListModalController',
				controllerAs: "popupCtrl",
				size: "",
				resolve: {
					parentData: function () { return ngCtrl; }
				}
			});
		}
		//#endregion
	}
	//#endregion


	//#region << Modal Controllers >>
	deleteListModalController.$inject = ['parentData', '$uibModalInstance', '$log', 'webvellaCoreService', 'ngToast', '$timeout', '$state'];
	
	function deleteListModalController(parentData, $uibModalInstance, $log, webvellaCoreService, ngToast, $timeout, $state) {
		
		var popupCtrl = this;
		popupCtrl.parentData = parentData;

		popupCtrl.ok = function () {

			webvellaCoreService.deleteEntityList(popupCtrl.parentData.list.name, popupCtrl.parentData.entity.name, successCallback, errorCallback);

		};

		popupCtrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		/// Aux
		function successCallback(response) {
			ngToast.create({
				className: 'success',
				content: '<span class="go-green">Success:</span> ' + response.message
			});
			$uibModalInstance.close('success');
			$timeout(function () {
				$state.go("webvella-admin-entity-lists", { entityName: popupCtrl.parentData.entity.name }, { reload: true });
			}, 0);
		}

		function errorCallback(response) {
			popupCtrl.hasError = true;
			popupCtrl.errorMessage = response.message;


		}
	};
	//#endregion

})();