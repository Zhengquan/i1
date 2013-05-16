jobApp.controller('jobController', function jobController($scope, $http) {
        $scope.serverShow = false;
        $scope.jobDetailShow = true;
        $scope.triggerShow = false;
        $scope.listenerShow = false;

        $scope.changeContent = function () {
            $scope.serverShow = false;
            $scope.jobDetailShow = false;
            $scope.triggerShow = false;
            $scope.listenerShow = false;
            $scope.cronpressShow = false;
        };

        $scope.units = [
            {"key": 0, "value": "秒"},
            {"key": 1, "value": "分钟"},
            {"key": 2, "value": "小时"},
            {"key": 3, "value": "天"}
        ];

        var TriggerInfo = function () {
            startTime = "";
            endTime = "";
            repeatInterval = 0;
            repeatIntervalUnit = 0;
        } ;

        $scope.triggerInfoList = [];
        $scope.triggerInfoList.push(new TriggerInfo());

        $scope.jobs = [];
        //初始化
        $scope.jobVO = new JobVO();
        $scope.jobVO.addJobDetail(new JobDetailVO());
        $scope.jobVO.addTrigger(new TriggerVO());

        $scope.saveJob = function () {

            $scope.jobVO.detail.addJobData("url", $scope.url);

            for (i = 0; i < $scope.triggerInfoList.length; i++) {

                var triggerTemp = $scope.triggerInfoList[i];
                var startDatetime = new Date(triggerTemp.startTime).getTime();
                $scope.jobVO.triggers[i].startTime = startDatetime;

                var endDatetime = new Date(triggerTemp.endTime).getTime();
                $scope.jobVO.triggers[i].endTime = endDatetime;

                $scope.jobVO.triggers[i].repeatInterval = getRepeatInterval(triggerTemp.repeatInterval, triggerTemp.repeatIntervalUnit);

            }
            ;

            var tempurl = Path.getUri("api/quartz-jobs/item");
            console.debug("----------------------");
            console.debug($scope.jobVO);
            $http.post(tempurl, $scope.jobVO).success(
                function (data, status, headers, config) {

                    alert("保存成功！");
                    $scope.jobs = [];
                    for (var j = 0; j < data.length; j++) {
                        var tempJob = new JobVO();
                        $scope.jobs.push(tempJob.copyJob(data[j]));
                    }
                    $scope.listQuartz();

                }).error(
                function (data, status, headers, config) {
                    alert("保存失败！");
                }
            );
        };


        $scope.listQuartz = function () {

            var url = Path.getUri("api/quartz-jobs/items");
            $http.get(url).success(
                function (data, status, headers, config) {
                    $scope.jobs = [];
                    for (var j = 0; j < data.length; j++) {
                        var tempJob = new JobVO();
                        $scope.jobs.push(tempJob.copyJob(data[j]));
                    }
                }).error(
                function (data, status, headers, config) {

                }
            );
        };

        $scope.addTrigger = function () {
            $scope.jobVO.addTrigger(new TriggerVO());
            $scope.triggerInfoList.push(new TriggerInfo());
        };


        function getRepeatInterval(repeatInterval, repeatIntervalUnit) {
            var temp = 0;
            if (repeatIntervalUnit === 0) {
                return repeatInterval * 1000;
            } else if (repeatIntervalUnit === 1) {
                return repeatInterval * 60 * 1000;
            } else if (repeatIntervalUnit === 2) {
                return repeatInterval * 60 * 60 * 1000;
            } else if (repeatIntervalUnit === 3) {
                return repeatInterval * 12 * 60 * 60 * 1000;
            }
            return temp;
        }


        $scope.getRepeatIntervalExpress = function (repeatInterval) {
            var temp = 0;
            var tempUnit = "秒"
            if (repeatInterval > 0) {
                if (repeatInterval % (12 * 60 * 60 * 1000) === 0) {
                    temp = repeatInterval / (12 * 60 * 60 * 1000);
                    tempUnit = "天"
                } else if (repeatInterval % (60 * 60 * 1000) === 0) {
                    temp = repeatInterval / (60 * 60 * 1000);
                    tempUnit = "小时"
                } else if (repeatInterval % (60 * 1000) === 0) {
                    temp = repeatInterval / (60 * 1000);
                    tempUnit = "分钟"
                } else {
                    temp = repeatInterval / (1000);
                    tempUnit = "秒"
                }
            }

            return temp + tempUnit;
        } ;

        $scope.listQuartz();


        //暂停
        $scope.pauseSchedule = function (trigger) {
            var triggerName = trigger.triggerName;
            var triggerGroupName = trigger.triggerGroupName;
            var pauseUrl = Path.getUri("api/quartz-jobs/pause-trigger/" + triggerName + "/" + triggerGroupName);
            $http.get(pauseUrl).success(
                function (data, status, headers, config) {
                    alert("执行暂停成功！");
                    $scope.listQuartz();
                }).error(
                function (data, status, headers, config) {
                    alert("暂停失败！");
                }
            );
        };

//        重启trigger
        $scope.resumeTrigger = function (trigger) {
            var resumeUrl = Path.getUri("api/quartz-jobs/resume-trigger/" + trigger.triggerName + "/" + trigger.triggerGroupName);
            $http.get(resumeUrl).success(
                function (data, status, headers, config) {
                    alert("重启执行成功！");
                    $scope.listQuartz();
                }
            ).error(
                function (data, status, headers, config) {
                    alert("重启失败！");
                }
            );
        } ;

//        从schedule里面移除trigger
        $scope.removeFromSchedule = function (trigger) {
            var removeUrl = Path.getUri("api/quartz-jobs/delete-trigger/" + trigger.triggerName + "/" + trigger.triggerGroupName);
            $http.get(removeUrl).success(
                function (data, status, headers, config) {
                    alert("移除成功！");
                }
            ).error(
                function (data, status, headers, config) {
                    alert("移除失败！");
                }
            )
        };




    }
)