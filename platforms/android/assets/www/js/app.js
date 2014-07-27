// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

    .factory('Projects', function() {
        return {
            // 1. Projects.all()
            // Returns the list of all projects
            all: function() {
                var projectString = window.localStorage['projects'];
                if(projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },

            // 2. Projects.save(projects)
            // Saves the project to local storage
            save: function(projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            
            // 3. Projects.newProject(projectTitle)
            // Return newProject with empty tasks
            newProject: function(projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
 
            // 4. Projects.getLastActiveIndex()
            // Return the index of last active project
            getLastActiveIndex: function() {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },

            // 5.Projects.setLastActiveIndex(index)
            // Saves the index of last active project to local storage
            setLastActiveIndex: function(index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    })

    .controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicPopup) {
        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {

            // 1. Returns a project with blank tasks.
            var newProject = Projects.newProject(projectTitle);

            // 2. Add new project in $scope.projects
            $scope.projects.push(newProject);

            // 3. Save projects with tasks in local storage
            Projects.save($scope.projects);

            // 4. Set the focus to the currently added project
            $scope.selectProject(newProject, $scope.projects.length-1);
        }

         // Load or initialize projects
        $scope.projects = Projects.all();

        // Grab the last active, or the first project
        $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

        // Called to create a new project
    
         $scope.newProject = function() {
           $scope.data = {}

           // An elaborate, custom popup
           var myPopup = $ionicPopup.show({
             template: '<input type="text" ng-model="data.result">',
             title: 'Enter Project Title',
             subTitle: 'Please enter valid project title',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },
               {
                 text: '<b>Save</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                   if (!$scope.data.result) {
                     //don't allow the user to close unless he enters wifi password
                     e.preventDefault();
                   } else {
                     return $scope.data.result;
                   }
                 }
               },
             ]
           });
           myPopup.then(function(res) {
            if (res) {

                createProject(res);

            };
             
           });
           $timeout(function() {
              myPopup.close(); //close the popup after 3 seconds for some reason
           }, 20000);
          };

        ///////////////////////////////


        // Called to select the given project
        $scope.selectProject = function(project, index) {
            $scope.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };


        // Create and load the Modal in the memory
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open our new task modal
        $scope.newTask = function() {
            $scope.taskModal.show();
        };
        
        // Close the new task modal
        $scope.createTask = function(task) {
            
            if(!$scope.activeProject || !task) {
            return;
            }

            $scope.activeProject.tasks.push({
            title: task.title
            });

            $scope.taskModal.hide();

            // Inefficient, but save all the projects
            Projects.save($scope.projects);

            task.title = "";
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $timeout(function() {
            if($scope.projects.length == 0) {
                while(true) {
                    var projectTitle = prompt('Your first project title:');
                    
                    if(projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                    
                }
            }
        });

        $scope.edit = function(task) {
            alert('Edit Item: ' + task.title);
        };
        $scope.share = function(task) {
            alert('Share Item: ' + task.title);
        };
  
})


    .run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
