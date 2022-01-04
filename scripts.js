const app = angular.module('myApp', ['ngMaterial']);

const apiUrl = "https://gateway.marvel.com:443/v1/public";
const timestamp = "1640684533442";
const apiKey = "5a237863b3cc2061003cbbc4fe20dc06";
const hash = "5833844b137a0634afee42c89432b98c";

app.controller('searchController', ($scope, $http) => {
	$scope.loading = false;
	$scope.characters = [];
	$scope.page = 0;
	$scope.total = 0;
	$scope.pageSize = 20;
	$scope.sizeOptions = [10, 20, 50, 100];
	$scope.search = "";
	$scope.selectedCharacter = null;

	$scope.lastPage = () => {
		return $scope.total > 0 ? Math.ceil($scope.total/$scope.pageSize) - 1 : 0;
	};

	$scope.pageTotal = () => {
		return `${$scope.page * $scope.pageSize + 1} a ${Math.min(($scope.page + 1) * $scope.pageSize, $scope.total)} de ${$scope.total}`;
	}

	$scope.changePage = (pageChange) => {
		$scope.page += pageChange;
		$scope.execSearch($scope.page);
	}

	$scope.execSearch = (page = 0) => {
		const config = {
			params: {
				ts: timestamp,
				apikey: apiKey,
				hash: hash,
				offset: page * $scope.pageSize,
			},
		};
		if ($scope.search) {
			config.params.nameStartsWith = $scope.search;
		}
		$scope.selectCharacter(null);
		$scope.getCharacters(config);
	};

	$scope.characterImage = (character) => {
		return `${character.thumbnail.path}.${character.thumbnail.extension}`;
	};

	$scope.characterComics = (character) => {
		return character.comics.items.map((comic) => comic.name).join(', ');
	}

	$scope.selectCharacter = (character) => {
		if (character) {
			$scope.getCharacter(character.id);
		} else {
			$scope.selectedCharacter = null;
		}
	};

	$scope.getCharacters = (config) => {
		$scope.loading = true;
		$http.get(`${apiUrl}/characters`, config)
			.then(({ data }) => {
				$scope.characters = data.data.results;
				$scope.total = data.data.total;
				$scope.loading = false;
			}, (error) => {
				console.log('error', error);
				$scope.loading = false;
			});
	};

	$scope.getCharacter = (id) => {
		const config = {
			params: {
				ts: timestamp,
				apikey: apiKey,
				hash: hash,
			},
		};
		$scope.loading = true;
		$http.get(`${apiUrl}/characters/${id}`, config)
			.then(({ data }) => {
				if (data.data.results.length) {
					$scope.selectedCharacter = data.data.results[0];
				}
				$scope.loading = false;
			}, (error) => {
				console.log('error', error);
				$scope.loading = false;
			});
	}

	$scope.execSearch();
});