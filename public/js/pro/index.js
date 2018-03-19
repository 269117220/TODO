var f = function f(_t) {
    var _this = this;

    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut');

    var data = {};
    /*
     *1、离线数据是否存在
     *2、是否是登陆状态
    */
    if (localStorage.localData) {
        localData = JSON.parse(localStorage.localData);
        data = localData.data;
        id = localData.id;
        username = localData.username;
        if (id) {
            var loginDiv = _e._$get("loginDiv");
            loginDiv.style.display = 'none';
            tokenId = id;
            recordTODO(id, username);
            changeClass(login, 'fa-odnoklassniki', 'fa-sign-out');
            login.innerHTML = '登出';
            var dataStatus = _e._$get("dataStatus");
            dataStatus.nextSibling.innerHTML = '欢迎您:' + '<B>' + username + '</B>';
            dataStatus.innerHTML = '&nbsp;在线';
            dataStatus.style.color = 'green';
            changeClass(dataStatus, 'fa-toggle-off', 'fa-toggle-on');
        } else {
            recordTODO();
        }
    }
    /*
    *模糊查询
    */
    var _onsearchTODO = function _onsearchTODO(_event) {
        /*初始化设置*/
        /*初始化页码*/
        globalPageManager = { '短期': 1, '长期': 1 };
        /*初始化显示：全部\未完成\已完成*/
        gChooseArr['短期'] = '短期_all';
        gChooseArr['长期'] = '长期_all';
        /*查询标记*/
        searchFlag = true;
        var todoThing = _e._$get("todoThing");
        var showAll = _e._$get('showAll');
        /*空字符串的情况下，回车显示全部记录*/
        if (todoThing.value == null || todoThing.value == '') {
            searchFlag = false;
            globalTempDate = JSON.parse(JSON.stringify(data));
            setHtml(data, 'repaint');
            showAll.style.display = 'none';
            return;
        }
        var searchText = todoThing.value.split("");
        globalTempDate = { '短期': { 'top': [], 'toDo': [], 'complete': [] }, '长期': { 'top': [], 'toDo': [], 'complete': [] } };
        searchText = '/.*' + searchText.join('.*') + '.*/';
        var numArr = { '短期': 0, '长期': 0
            /*模糊匹配，记录相似数据*/
        };for (var keyValue in data) {
            var categoryData = data[keyValue];
            for (var cKey in categoryData) {
                var arr = categoryData[cKey];
                arr.forEach(function (todoInfo, index) {
                    var matchResult = ('' + todoInfo['message']).match(eval(searchText));
                    if (matchResult != null && matchResult.length) {
                        globalTempDate[keyValue][cKey].push(todoInfo);
                        numArr[keyValue]++;
                    } else {
                        globalTempDate[keyValue][cKey].push('');
                    }
                });
            }
        }
        if (!numArr['短期']) delete globalTempDate['短期'];
        if (!numArr['长期']) delete globalTempDate['长期'];
        searchData = JSON.parse(JSON.stringify(globalTempDate));

        /*显示返回全部记录按钮*/
        showAll.style.display = 'inline-block';
        setHtml(searchData, 'search');
    };
    /*
    *显示全部记录
    */
    var _onshowAll = function _onshowAll() {
        _e._$get("todoThing").value = '';
        _e._$get("showAll").style.display = 'none';
        _onsearchTODO();
    };
    /*
    *AJAX:更新记录
    */
    var updateTODO = function updateTODO(message) {
        if (tokenId) {
            obj = { 'TODO': data, 'id': tokenId };
            _j._$request('../../api/todos', {
                sync: false,
                method: 'POST',
                data: obj,
                type: 'json',
                onload: function onload(_json) {
                    if (_json.code == 1) {
                        infoTip(false, message);
                    } else if (_json.code == 0) {
                        infoTip(true, '操作失败');
                    }
                }
            });
        }
    };
    /*
    *登陆面板的控制
    */
    var _onLoginShow = function _onLoginShow(_event) {
        var _target = _v._$getElement(_event);
        if (_target.innerHTML != '登出') {
            /*登录的情况*/
            if (_target.parentNode.parentNode.style.right == '0px') {
                _target.parentNode.parentNode.style.display = 'none';
                _target.parentNode.parentNode.style.right = '-350px';
                setTimeout(function () {
                    _target.parentNode.parentNode.style.display = 'inline-block';
                }, 100);
            } else _target.parentNode.parentNode.style.right = '0px';
        } else {
            /*登出的情况*/
            var loginDiv = _e._$get("loginDiv");
            loginDiv.style.display = 'inline-block';
            var username = _e._$get("username");
            var password = _e._$get("password");
            username.value = '';
            password.value = '';
            var dataStatus = _e._$get("dataStatus");
            dataStatus.style.color = 'red';
            changeClass(dataStatus, 'fa-toggle-off', 'fa-toggle-on');
            dataStatus.innerHTML = '离线';
            var login = _e._$get("login");
            changeClass(login, 'fa-odnoklassniki', 'fa-sign-out');
            login.innerHTML = '登录';
            dataStatus.nextSibling.style.display = 'none';
            infoTip(false, '离线成功');
            tokenId = '';
            recordTODO(tokenId, '');
        }
    };
    /*
    *注册和登陆面板的切换
    */
    var _onRegisterShow = function _onRegisterShow(_event) {
        var _target = _v._$getElement(_event);
        if (_target.innerHTML != '登    录') {
            /*注册时的界面*/
            _target.innerHTML = '登    录';
            var password = _e._$get("password");
            password.value = '';
            var button = _e._$get("submit");
            button.setAttribute('value', '注    册');
        } else {
            /*登录时的界面*/
            var username = _e._$get("username");
            var password = _e._$get("password");
            username.style.borderBottom = '';
            password.style.borderBottom = '';
            _target.innerHTML = '注    册';
            var password = _e._$get("password");
            password.value = '';
            var button = _e._$get("submit");
            button.setAttribute('value', '登    录');
        }
    };
    /*
    *AJAX:注册和登陆
    */
    var registerOK = false;
    var _onRegister = function _onRegister(_event) {
        var _target = _v._$getElement(_event);
        var username = _e._$get("username");
        var password = _e._$get("password");
        username.style.borderBottom = '';
        password.style.borderBottom = '';
        if (username.value.trim() == '' || password.value.trim() == '') {
            username.value.trim() == '' ? username.style.borderBottom = '1px solid red' : '';
            password.value.trim() == '' ? password.style.borderBottom = '1px solid red' : '';
            return;
        }
        var obj = { 'username': username.value, 'password': password.value };
        if (_target.value.replace(/\s*/g, '') == '注册') {
            /*注册时的AJAX*/
            _j._$request('../../api/users', {
                sync: false,
                method: 'POST',
                data: obj,
                type: 'json',
                onload: function onload(_json) {
                    obj = {};
                    var register = _e._$get("register");
                    if (_json.code == 1) {
                        infoTip(false, '注册成功');
                        register.style.display = 'none';
                        setTimeout(function () {
                            _target.setAttribute('value', '登    录');
                            var registerSpan = _e._$get("register");
                            registerSpan.innerHTML = '去注册';
                            register.style.display = 'inline-block';
                            password.value = '';
                        }, 1000);
                    } else if (_json.code == 0) {
                        infoTip(true, '注册失败');
                    } else {
                        var username = _e._$get("username");
                        username.style.borderBottom = '1px solid red';
                        username.value = '';
                        username.placeholder = '该账户已存在';
                    }
                }
            });
        } else {
            /*登录时的AJAX*/
            _j._$request('../../api/login', {
                sync: false,
                method: 'POST',
                data: obj,
                type: 'json',
                onload: function onload(_json) {
                    data = {};
                    var registerTip = _e._$get("registerTip");
                    if (_json.code == 1) {
                        tokenId = _json.userId;
                        var flag = true;
                        if (localStorage.localData) {
                            tempData = JSON.parse(localStorage.localData);
                            if (tempData.cryptoId == _json.crypto) {
                                flag = false;
                                data = tempData.data;
                                updateTODO('数据同步完成');
                            }
                        }
                        if (flag) {
                            if (Object.keys(_json.TODO).length) 
                                data = _json.TODO;
                            infoTip(false, '数据同步完成');
                        }
                        setHtml(data);
                        globalTempDate = JSON.parse(JSON.stringify(data));
                        recordTODO(tokenId, _json.username, _json.crypto);
                        /*界面样式修改*/
                        var login = _e._$get("login");
                        login.click();
                        var loginDiv = _e._$get("loginDiv");
                        loginDiv.style.display = 'none';
                        changeClass(login, 'fa-odnoklassniki', 'fa-sign-out');
                        login.innerHTML = '登出';
                        var dataStatus = _e._$get("dataStatus");
                        dataStatus.nextSibling.style.display = 'inline-block';
                        dataStatus.nextSibling.innerHTML = '欢迎您:' + '<B>' + _json.username + '</B>';
                        dataStatus.innerHTML = '&nbsp;在线';
                        dataStatus.style.color = 'green';
                        setTimeout(function () {
                            changeClass(dataStatus, 'fa-toggle-off', 'fa-toggle-on');
                        }, 2000);
                    } else if (_json.code == 0) {
                        infoTip(true, '用户名/密码错误');
                    } else {
                        infoTip(true, '该用户不存在');
                    }
                }
            });
        }
    };
    /*
    *双击编辑
    */
    var _onItemClick = function _onItemClick(_event) {
        var _target = _v._$getElement(_event);
        if (_target.getAttribute('class') == 'infoText') {
            _target.disabled = false;
            _target.focus();
            _target.style.border = "1px solid #C5C5C5";
            _target.style.boxShadow = "0px 0px 2px gray inset";
            _target.parentNode.childNodes[5].style.width = '0px';
            _target.parentNode.childNodes[5].style.visibility = 'hidden';
            _target.parentNode.childNodes[7].style.width = '0px';
            _target.parentNode.childNodes[7].style.visibility = 'hidden';
            if (_target.parentNode.childNodes.length == 11) {
                _target.parentNode.childNodes[9].style.width = '0px';
                _target.parentNode.childNodes[9].style.visibility = 'hidden';
            }
        }
    };
    /*
    *编辑成功后数据和样式的修改
    */
    var _onItemBlur = function _onItemBlur(_event) {
        var _target = _v._$getElement(_event);
        /*修改数据*/
        var arr = _target.getAttribute('name').split('_');
        data[arr[0]][arr[1]][arr[2]]['message'] = _target.value;
        globalTempDate[arr[0]][arr[1]][arr[2]]['message'] = _target.value;
        if (searchFlag) {
            searchData[arr[0]][arr[1]][arr[2]]['message'] = _target.value;
        }
        updateTODO('修改成功');
        /*修改样式*/
        _target.style.border = "none";
        _target.style.boxShadow = "";
        _target.disabled = true;
        _target.parentNode.childNodes[5].style.width = '100px';
        _target.parentNode.childNodes[5].style.visibility = 'visible';
        _target.parentNode.childNodes[7].style.width = '24px';
        _target.parentNode.childNodes[7].style.visibility = 'visible';
        if (_target.parentNode.childNodes.length == 11) {
            _target.parentNode.childNodes[9].style.width = '14px';
            _target.parentNode.childNodes[9].style.visibility = 'visible';
        }
    };
    /*
    *回车确认
    */
    var _onUpdateItem = function _onUpdateItem(_event) {
        var code = _event.charCode || _event.keyCode;
        if (code == 13) {
            _onItemBlur(_event);
        }
    };
    /*
    *获取全部记录的数目
    */
    var getNum = function getNum(data, cName) {
        var objTemp = data[cName],
            num = 0;
        for (var keyName in objTemp) {
            num += objTemp[keyName].length;
        }
        return num;
    };
    /*
    *获取搜索记录的数目
    */
    var getSearchNum = function getSearchNum(data, cName) {
        var objTemp = data[cName],
            num = 0;
        for (var keyName in objTemp) {
            objTemp[keyName].forEach(function (TODO, index) {
                if (TODO != '') num++;
            });
        }
        return num;
    };
    /*
    *删除记录
    */
    var _onItemRemove = function _onItemRemove(_event) {
        var _target = _v._$getElement(_event);
        var dataArr = _target.getAttribute('name').split("_");
        var temp = data;
        data[dataArr[0]][dataArr[1]].splice(dataArr[2], 1);
        globalTempDate[dataArr[0]][dataArr[1]].splice(dataArr[2], 1);
        var searchNum = -1;
        /*判断是否为搜索状态*/
        if (searchFlag) {
            searchData[dataArr[0]][dataArr[1]].splice(dataArr[2], 1);
            searchNum = getSearchNum(searchData, dataArr[0]);
            if (searchNum == 0) {
                delete searchData[dataArr[0]];
                delete globalTempDate[dataArr[0]];
            }
        }
        /*数量为0时删除该分类{短期，长期}*/
        var num = getNum(data, dataArr[0]);
        if (num == 0) {
            delete data[dataArr[0]];
            delete globalTempDate[dataArr[0]];
        }
        if (searchFlag && !searchNum) setHtml(searchData, 'search');else setHtml(globalTempDate, 'changeData');
        updateTODO('删除成功');
    };
    globalTempDate = JSON.parse(JSON.stringify(data));
    /*
    *状态切换：全部/待完成/已完成
    */
    var _onChangeItemShow = function _onChangeItemShow(_event) {
        var _target = _v._$getElement(_event);
        var dataArr = _target.getAttribute('name').split("_");
        gChooseArr[_target.parentNode.getAttribute('id')] = _target.getAttribute('id');
        if (!searchFlag) {
            var tempDate = JSON.parse(JSON.stringify(data));
            globalTempDate[dataArr[0]] = tempDate[dataArr[0]];
            globalTempDate[dataArr[0]][dataArr[1]] = [];
            if (dataArr[1] == 'toDo') globalTempDate[dataArr[0]]['top'] = [];
            globalPageManager = { '短期': 1, '长期': 1 };
            frontIndex = 0;
            setHtml(globalTempDate, 'changeChoose');
        } else {
            var tempDate = JSON.parse(JSON.stringify(searchData));
            globalTempDate[dataArr[0]] = tempDate[dataArr[0]];
            globalTempDate[dataArr[0]][dataArr[1]] = [];
            if (dataArr[1] == 'toDo') globalTempDate[dataArr[0]]['top'] = [];
            globalPageManager = { '短期': 1, '长期': 1 };
            frontIndex = 0;
            setHtml(globalTempDate, 'changeChoose');
        }
    };
    /*
    *参数：目标元素/class1/class2
    *目标元素的class1和class2切换
    */
    function changeClass(_target, value, otherValue) {
        if (!_target) {
            return;
        }
        var classStr = _target.getAttribute('class');
        if (classStr.includes(value)) {
            _target.setAttribute('class', classStr.replace(value, otherValue));
            if (value == 'fa-square-o') _target.nextSibling.nextSibling.style = "text-decoration:line-through;color:#D9D9D9";
        } else {
            _target.setAttribute('class', classStr.replace(otherValue, value));
            if (value == 'fa-square-o') _target.nextSibling.nextSibling.style = "";
        };
        var classStr = _target.getAttribute('class');
    }
    /*
    *待完成和已完成状态的切换
    */
    var _onChangeChoose = function _onChangeChoose(_event) {
        var _target = _v._$getElement(_event);
        var classStr = _target.getAttribute('class');
        var arr = _target.getAttribute('name').split("_");
        if (classStr.includes('fa-square-o')) {
            data[arr[0]]['complete'].splice(0, 0, data[arr[0]][arr[1]][arr[2]]);
            data[arr[0]][arr[1]].splice(arr[2], 1);
            if (gChooseArr[arr[0]] != arr[0] + '_all') {
                globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(data[arr[0]][arr[1]]));
            }
            if (searchFlag) {
                searchData[arr[0]]['complete'].splice(0, 0, searchData[arr[0]][arr[1]][arr[2]]);
                searchData[arr[0]][arr[1]].splice(arr[2], 1);
            }
        } else {
            data[arr[0]]['toDo'].splice(0, 0, data[arr[0]][arr[1]][arr[2]]);
            data[arr[0]][arr[1]].splice(arr[2], 1);
            if (gChooseArr[arr[0]] != arr[0] + '_all') {
                globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(data[arr[0]][arr[1]]));
            }
            if (searchFlag) {
                searchData[arr[0]]['toDo'].splice(0, 0, searchData[arr[0]][arr[1]][arr[2]]);
                searchData[arr[0]][arr[1]].splice(arr[2], 1);
            }
        }
        if (gChooseArr[arr[0]] == arr[0] + '_all') {
            if (!searchFlag) globalTempDate[arr[0]] = JSON.parse(JSON.stringify(data[arr[0]]));else globalTempDate[arr[0]] = JSON.parse(JSON.stringify(searchData[arr[0]]));
        }
        setHtml(globalTempDate, "changeDate");
        updateTODO('操作成功');
    };
    /*
    *回车确认
    */
    var _onkeyup = function _onkeyup(_event) {
        searchFlag = false;
        var code = _event.charCode || _event.keyCode;
        /*监听回车事件*/
        if (code == 13) {
            var username = _e._$get('username');
            var password = _e._$get('password');
            if (document.activeElement.id == 'username' || document.activeElement.id == 'password') {
                var _login = _e._$get("submit");
                _login.click();
                return;
            }
            var showAll = _e._$get('showAll');
            showAll.style.display = 'none';
            var _target = _v._$getElement(_event);
            var addItemInfo = _target.value;
            if (addItemInfo.trim() == '') {
                return;
            }
            _target.value = "";
            var _radios = _e._$getByClassName('categoryChoose', "changeRadio");
            var chooseName = '';
            _u._$forEach(_radios, function (_item) {
                var classStr = _item.getAttribute('class');
                if (classStr.includes('fa-check-circle-o')) {
                    chooseName = _item.getAttribute('name');
                }
            }, _this);
            var newMeaasge = { 'message': addItemInfo, 'time': getCurrTime() };
            for (var cName in gChooseArr) {
                gChooseArr[cName] = cName + '_all';
            }gChooseArr[chooseName] = chooseName + '_all';
            /*如果相关类别不存在，则进行初始化*/
            if (!data[chooseName]) {
                data[chooseName] = { 'top': [],
                    'toDo': [],
                    'complete': []
                };
                data[chooseName]['toDo'].unshift(newMeaasge);
                globalTempDate = JSON.parse(JSON.stringify(data));
                /*首次展示的情况*/
                setHtml(data);
            } else {
                data[chooseName]['toDo'].unshift(newMeaasge);
                globalTempDate = JSON.parse(JSON.stringify(data));
                /*非首次情况下的展示*/
                setHtml(data, "changeDate");
            }
            updateTODO('添加成功');
        }
    };
    /*
    *翻页时的页码
    */
    var updatePageNum = function updatePageNum(idName) {
        var itemNum = _e._$get(idName + '_num').innerHTML;
        itemNum = parseInt(itemNum.split("条")[0].trim());
        return Math.ceil(itemNum / itemShowNum);
    };
    /*
    *翻页：单页显示4条记录
    */
    var _onchangePage = function _onchangePage(_event) {
        var _target = _v._$getElement(_event);
        var classStr = _target.getAttribute('class');
        var classArr = classStr.split(" ");
        var pageChange = classArr[classArr.length - 1];
        var pageChangeArr = pageChange.split("_");
        pageMax = updatePageNum(pageChangeArr[0]);
        if (pageChangeArr[1] == 'front') {
            if (globalPageManager[pageChangeArr[0]] > 1) {
                var currPageNum = globalPageManager[pageChangeArr[0]] - 1;
                globalPageManager[pageChangeArr[0]] = currPageNum;
                //改变数据
                var currIndex = (currPageNum - 1) * itemShowNum;
                frontIndex = currIndex;
                setHtml(globalTempDate, 'changePage');
            }
        } else {
            if (globalPageManager[pageChangeArr[0]] < pageMax) {
                var currPageNum = globalPageManager[pageChangeArr[0]] + 1;
                globalPageManager[pageChangeArr[0]] = currPageNum;
                var currIndex = (currPageNum - 1) * itemShowNum;
                frontIndex = currIndex;
                setHtml(globalTempDate, 'changePage');
            }
        }
    };
    /*
    *置顶/取消置顶操作
    */
    var _onchangeStar = function _onchangeStar(_event) {
        var _target = _v._$getElement(_event);
        var classStr = _target.getAttribute('class');
        if (classStr.includes('fa-star-o')) {
            var arr = _target.getAttribute('name').split("_");
            data[arr[0]]['top'].splice(0, 0, data[arr[0]][arr[1]][arr[2]]);
            data[arr[0]][arr[1]].splice(arr[2], 1);
            if (gChooseArr[arr[0]] != arr[0] + '_all') {
                globalTempDate[arr[0]]['top'] = JSON.parse(JSON.stringify(data[arr[0]]['top']));
                globalTempDate[arr[0]][arr[1]].length != 0 ? globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(data[arr[0]][arr[1]])) : "";
            }
            if (searchFlag) {
                searchData[arr[0]]['top'].splice(0, 0, searchData[arr[0]][arr[1]][arr[2]]);
                searchData[arr[0]][arr[1]].splice(arr[2], 1);
            }
        } else {
            var arr = _target.getAttribute('name').split("_");
            data[arr[0]]['toDo'].splice(0, 0, data[arr[0]][arr[1]][arr[2]]);
            data[arr[0]][arr[1]].splice(arr[2], 1);
            globalTempDate[arr[0]]['toDo'] = JSON.parse(JSON.stringify(data[arr[0]]['toDo']));
            globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(data[arr[0]][arr[1]]));
            if (gChooseArr[arr[0]] != arr[0] + '_all') {
                globalTempDate[arr[0]][arr[1]].length != 0 ? globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(data[arr[0]][arr[1]])) : "";
            }
            if (searchFlag) {
                searchData[arr[0]]['toDo'].splice(0, 0, searchData[arr[0]][arr[1]][arr[2]]);
                searchData[arr[0]][arr[1]].splice(arr[2], 1);
                globalTempDate[arr[0]]['toDo'] = JSON.parse(JSON.stringify(searchData[arr[0]]['toDo']));
                globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(searchData[arr[0]][arr[1]]));
                if (gChooseArr[arr[0]] != arr[0] + '_all') {
                    globalTempDate[arr[0]][arr[1]].length != 0 ? globalTempDate[arr[0]][arr[1]] = JSON.parse(JSON.stringify(searchData[arr[0]][arr[1]])) : "";
                }
            }
        }
        if (gChooseArr[arr[0]] == arr[0] + '_all') {
            if (!searchFlag) globalTempDate[arr[0]] = JSON.parse(JSON.stringify(data[arr[0]]));else globalTempDate[arr[0]] = JSON.parse(JSON.stringify(searchData[arr[0]]));
        }
        setHtml(globalTempDate, "changeDate");
        updateTODO('置顶成功');
    };
    /*
    *创建时,短期/长期任务的选择
    */
    var _radios;
    var _onchangeRadio = function _onchangeRadio(_event) {
        var _target = _v._$getElement(_event);
        var classStr = _target.getAttribute('class');
        if (classStr.includes('fa-circle-o')) {
            _u._$forEach(_radios, function (_item) {
                changeClass(_item, 'fa-check-circle-o', 'fa-circle-o');
            }, _this);
        }
    };
    /*
    *用户离开15分钟后登出
    */
    var _onsessionManage = function _onsessionManage(_event) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (tokenId) {
                var login = _e._$get("login");
                login.click();
                clearTimeout(timer);
            }
        }, 1000 * 60 * 15);
    };
    /*设置事件*/
    var setEvent = function setEvent() {
        /*登录面板控制*/
        var _login = _e._$get("login");
        _v._$addEvent(_login, 'click', _onLoginShow);
        /*注册面板控制*/
        var _register = _e._$get("register");
        _v._$addEvent(_register, 'click', _onRegisterShow);
        /*注册*/
        var _submit = _e._$get("submit");
        _v._$addEvent(_submit, 'click', _onRegister);
        var _username = _e._$get("username");
        var _password = _e._$get("password");
        _v._$addEvent(_username, 'keyup', _onkeyup);
        _v._$addEvent(_password, 'keyup', _onkeyup);
        /*添加TODO条目*/
        var _addElement = _e._$get("todoThing");
        _v._$addEvent(_addElement, 'keyup', _onkeyup);
        /*搜索TODO条目*/
        var _searchTODO = _e._$get("searchTODO");
        _v._$addEvent(_searchTODO, 'click', _onsearchTODO);
        /*显示全部记录*/
        var _showAllTODO = _e._$get("showAll");
        _v._$addEvent(_showAllTODO, 'click', _onshowAll);
        /*双击编辑记录*/
        var _xItems = _e._$getByClassName('containerDiv', "infoColumn");
        _u._$forEach(_xItems, function (_item) {
            _v._$addEvent(_item, 'dblclick', _onItemClick);
        }, _this);
        /*文本失去焦点时状态的变化*/
        var _infoItems = _e._$getByClassName('containerDiv', "infoText");
        _u._$forEach(_infoItems, function (_item) {
            _v._$addEvent(_item, 'keyup', _onUpdateItem);
            _v._$addEvent(_item, 'blur', _onItemBlur);
        }, _this);
        /*删除记录*/
        var _removeItems = _e._$getByClassName('containerDiv', "infoTextRemove");
        _u._$forEach(_removeItems, function (_item) {
            _v._$addEvent(_item, 'click', _onItemRemove);
        }, _this);
        /*改变显示条目：all toDo complete*/
        var _changeItems = _e._$getByClassName('containerDiv', "change");
        _u._$forEach(_changeItems, function (_item) {
            _v._$addEvent(_item, 'click', _onChangeItemShow);
        }, _this);
        /*改变条目的状态*/
        var _completeChooses = _e._$getByClassName('containerDiv', "choose");
        _u._$forEach(_completeChooses, function (_item) {
            _v._$addEvent(_item, 'click', _onChangeChoose);
        }, _this);
        /*分页*/
        var _pageFront = _e._$getByClassName('containerDiv', "changePageIcon");
        _u._$forEach(_pageFront, function (_item) {
            _v._$addEvent(_item, 'click', _onchangePage);
        }, _this);
        /*置顶*/
        var _itemStars = _e._$getByClassName('containerDiv', "itemStar");
        _u._$forEach(_itemStars, function (_item) {
            _v._$addEvent(_item, 'click', _onchangeStar);
        }, _this);
        /*改变todo类型*/
        _radios = _e._$getByClassName('categoryChoose', "changeRadio");
        _u._$forEach(_radios, function (_item) {
            _v._$addEvent(_item, 'click', _onchangeRadio);
        }, _this);
        /*设置登录有效时间*/
        _v._$addEvent(document, 'click', _onsessionManage);
    };
    /*
    *更新html模板
    */
    var _parent = _e._$get('containerDiv');
    _t._$add('jst-template-1');
    function setHtml(data, _target) {
        var _html = _t._$get('jst-template-1', {
            category: data
        });
        _parent.innerHTML = _html.trim() == '' ? '<span style="color:gray;margin-top:100px;text-align:center">' + '分为短期/长期记录<br/>' + '模糊查询TODO记录<br/>' + '优先级更高的记录可以置顶<br/>' + '双击编辑记录<br/>' + '</span>' : _html;
        setEvent();
        //设置选中状态
        if (_target) {
            for (var nodeName in gChooseArr) {
                var choosedNode = _e._$get(gChooseArr[nodeName]);
                changeClass(choosedNode, 'change active', 'change');
            };
        } else {
            var buttons = _e._$getByClassName('containerDiv', "categoryButtons");
            _u._$forEach(buttons, function (_item) {
                var firtNode = _item.childNodes[1];
                gChooseArr[_item.getAttribute('id')] = firtNode.getAttribute('id');
                changeClass(firtNode, 'change active', 'change');
            }, this);
        }

        if (_target == 'search') {
            var _categoryDivs = _e._$getByClassName('containerDiv', "categoryDiv");
            if (_categoryDivs.length == 0) _parent.innerHTML = '<span class="fa fa-warning" style="color:gray;margin-top:100px;text-align:center;font-size:25px;">&nbsp;无相关记录</span>';
        }
    }
    setHtml(data);
    /*
    *更新本地离线记录
    */
    function recordTODO(userId, username, cryptoId) {
        if (cryptoId) {
            localData.cryptoId = cryptoId;
        }
        localData.id = userId;
        localData.username = username;
        setInterval(function () {
            localData.data = data;
            localStorage.localData = JSON.stringify(localData);
        }, 2000);
    }
    /*
    *操作提示信息
    */
    function infoTip(flag, message) {
        var infoTipDiv = _e._$get("infoTip");
        var infoContainer = _e._$get("infoContainer");
        var infoMessage = _e._$get("infoMessage");
        if (flag) {
            infoTipDiv.style.backgroundColor = '#F2DEDE';
            infoContainer.style.color = '#A94442';
            infoMessage.innerHTML = '<B>Warning! </B>' + message;
        } else {
            infoTipDiv.style.backgroundColor = '#DFF0D8';
            infoContainer.style.color = '#46763D';
            infoMessage.innerHTML = '<B>Well done! </B>' + message;
        }
        infoTipDiv.style.top = '0';
        setTimeout(function () {
            infoTipDiv.style.top = '-42px';
        }, 3000);
    }
};
define(['util/template/jst', '{lib}base/event.js', '{lib}util/ajax/xdr.js'], f);