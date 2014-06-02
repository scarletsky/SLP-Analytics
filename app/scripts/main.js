// /* 即时更新 */
// var Gaze = require('gaze').Gaze;
// var gaze = new Gaze('**/*');

// gaze.on('all', function (event, filepath) {
//     if (location) {
//         location.reload();
//     }
// });

/* 导入依赖 */
var events = require('events');
var eventProxy = require('eventproxy');
var _ = require('lodash');
var db = require('../scripts/db');
var tpls = require('../scripts/tpls');
var utils = require('../scripts/utils')(jQuery, _);

var emitter = new events.EventEmitter();
var ep = new eventProxy();

// slp 是全局变量，保存每一步需要的数据
window.slp = {};

$(document).ready(function () {

// 页面跳转
$(document).on('click', 'a[data-route], button[data-route]', function (e) {
    var field = $(this);
    var route = field.data('route');
    var actionType = field.data('action-type');

    if (actionType === 'edit' || actionType === 'manage') {
        var row = field.parents('tr');
        var data = utils.getRowData(row);

        slp[row.data('klass')] = data;
    }

    emitter.emit('routeChange', route, actionType);

    return e.preventDefault();
});

// 处理模板
emitter.on('routeChange', function (route, actionType) {
    $('.container').load('./' + route + '.html', function () {
        var rows = [];
        var thead, tbody;
        switch (route) {
        // 登录页面
        case 'login':

            break;

        // 工厂列表
        case 'factory':
            db.all('SELECT * from Factory WHERE user_id = $userId LIMIT 5', {
                $userId: slp.user.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var tr = tpls.factory(obj.id, obj.name, obj.remark);
                    rows.push(tr);
                });

                $('#factory tbody').html(rows);
            });
            break;

        // 编辑工厂
        case 'editFactory':
            if (actionType === 'edit') {
                $('#editFactory input[name="action"]').val('edit');
                $('#editFactory input[name="id"]').val(slp.factory.id);
                $('#editFactory input[name="name"]').val(slp.factory.name);
                $('#editFactory textarea[name="remark"]').val(slp.factory.remark);
            } else {
                $('#editFactory input[name="action"]').val('add');
            }
            break;

        // 管理工厂
        case 'manageFactory':
            $('#manageFactory #factoryName').text(slp.factory.name);
            slp.analysisType = '';

            // getUnits
            db.all('SELECT * FROM Unit WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getUnits'));

            // getParts
            db.all('SELECT * FROM Part WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getParts'));

            // getCrafts
            db.all('SELECT * FROM Craft WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getCrafts'));

            // getReasons
            db.all('SELECT * FROM NonlogisticsReason WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getReasons'))
 
            //get result
            db.get('SELECT * FROM Result WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, result) {
                if (result) {
                    slp.result = result;
                    $('#manageFactory #readResultBtn').removeClass('disabled');
                }
            });

            ep.all('getUnits', 'getParts', 'getCrafts', function (units, parts, crafts) {
                slp.units = units;
                slp.parts = parts;
                slp.crafts = crafts;

                if (units.length && parts.length && crafts.length) {
                    $('#manageFactory #flowBtn').removeClass('disabled');
                    $('#manageFactory #togetherBtn').removeClass('disabled');
                }
            });

            ep.all('getUnits', 'getReasons', function (units, reasons) {
                slp.reasons = reasons;

                if (units.length && reasons.length) {
                    $('#manageFactory #nonFlowBtn').removeClass('disabled');
                }
            });

            break;

        // 作业单位列表
        case 'unit':
            $('#manageFactory #factoryName').text(slp.factory.name);
            db.all('SELECT * from Unit WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var tr = tpls.unit(obj.id, obj.num, obj.name, obj.usage, obj.remark);
                    rows.push(tr);
                });

                $('#unit tbody').html(rows);
            });
            break;

        // 编辑作业单位
        case 'editUnit':
            if (actionType === 'edit') {
                $('#editUnit input[name="action"]').val('edit');
                $('#editUnit input[name="factoryId"]').val(slp.factory.id);
                $('#editUnit input[name="id"]').val(slp.unit.id);
                $('#editUnit input[name="num"]').val(slp.unit.num);
                $('#editUnit input[name="name"]').val(slp.unit.name);
                $('#editUnit input[name="usage"]').val(slp.unit.usage);
                $('#editUnit textarea[name="remark"]').val(slp.unit.remark);
            } else {
                $('#editUnit input[name="action"]').val('add');
                $('#editUnit input[name="factoryId"]').val(slp.factory.id);
            }
            break;

        // 零件列表
        case 'part':
            $('#manageFactory #factoryName').text(slp.factory.name);
            db.all('SELECT * from Part WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var tr = tpls.part(obj.id, obj.name, obj.remark);
                    rows.push(tr);
                });

                $('#part tbody').html(rows);
            });

            break;

        // 编辑零件
        case 'editPart':
            if (actionType === 'edit') {
                $('#editPart input[name="action"]').val('edit');
                $('#editPart input[name="factoryId"]').val(slp.factory.id);
                $('#editPart input[name="id"]').val(slp.part.id);
                $('#editPart input[name="name"]').val(slp.part.name);
                $('#editPart textarea[name="remark"]').val(slp.part.remark);
            } else {
                $('#editPart input[name="action"]').val('add');
                $('#editPart input[name="factoryId"]').val(slp.factory.id);
            }
            break;

        // 工艺路线列表
        case 'craft':
            $('#manageFactory #factoryName').text(slp.factory.name);
            db.all('SELECT ' + 
                       'Craft.id, Craft.part_id, Part.name, Craft.route, Craft.carrying, Craft.remark ' + 
                   'FROM ' + 
                       'Craft ' + 
                   'INNER JOIN ' + 
                       'Part ' + 
                   'ON ' + 
                       'Craft.factory_id = Part.factory_id AND ' + 
                       'Craft.part_id = Part.id AND '+ 
                       'Craft.factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var tr = tpls.craft(obj.id, obj.part_id, obj.name, obj.route, obj.carrying, obj.remark);
                    rows.push(tr);
                });

                $('#craft tbody').html(rows);
            });

            break;

        // 编辑工艺路线
        case 'editCraft':
            var options = [];
            db.all('SELECT * FROM Part WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var option = tpls.craftPartOption(obj.id, obj.name);
                    options.push(option);
                });

                $('#editCraft select').html(options);

                if (actionType === 'edit') {
                    $('#editCraft input[name="action"]').val('edit');
                    $('#editCraft input[name="factoryId"]').val(slp.factory.id);
                    $('#editCraft input[name="id"]').val(slp.craft.id);
                    $('#editCraft select[name="partId"]').val(slp.craft.part_id);
                    $('#editCraft input[name="route"]').val(slp.craft.route);
                    $('#editCraft input[name="carrying"]').val(slp.craft.carrying);
                    $('#editCraft textarea[name="remark"]').val(slp.craft.remark);
                } else {
                    $('#editCraft input[name="action"]').val('add');
                    $('#editCraft input[name="factoryId"]').val(slp.factory.id);
                }
            });
            break;

        // 非物流信息相关原因
        case 'nonFlowReason':
            $('#manageFactory #factoryName').text(slp.factory.name);
            db.all('SELECT * FROM NonlogisticsReason WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, row) {
                $.each(row, function (i, obj) {
                    var tr = tpls.nonFlowReason(obj.id, obj.num, obj.reason);
                    rows.push(tr);
                });

                $('#nonFlowReason tbody').html(rows);
            });
            break;

        // 编辑非物流信息相关原因
        case 'editNonFlowReason':
            if (actionType === 'edit') {
                $('#editNonFlowReason input[name="action"]').val('edit');
                $('#editNonFlowReason input[name="factoryId"]').val(slp.factory.id);
                $('#editNonFlowReason input[name="id"]').val(slp.reason.id);
                $('#editNonFlowReason input[name="num"]').val(slp.reason.num);
                $('#editNonFlowReason textarea[name="reason"]').val(slp.reason.reason);
            } else {
                $('#editNonFlowReason input[name="action"]').val('add');
                $('#editNonFlowReason input[name="factoryId"]').val(slp.factory.id);
            }
            break;

        // 作业单位相互关系分析
        case 'nonFlowIntension':
            db.all('SELECT ' +
                       'Nonlogistics.id, Nonlogistics.factory_id, Nonlogistics.pair, Nonlogistics.level, Nonlogistics.reason ' +
                   'FROM ' +
                       'Nonlogistics ' +
                   'INNER JOIN ' +
                       'NonlogisticsReason ' +
                   'ON ' +
                       'Nonlogistics.factory_id = NonlogisticsReason.factory_id AND ' +
                       'Nonlogistics.reason = NonlogisticsReason.num AND ' +
                       'Nonlogistics.factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, function (err, nonFlowIntension) {
                slp.nonFlowIntension = nonFlowIntension;

                if (slp.analysisType === 'together') {
                    var breads = [
                        '<li><a href="#" data-route="fromToTable">从至表</a></li>',
                        '<li><a href="#" data-route="flowIntensionTable">物流强度表</a></li>',
                        '<li><a href="#" data-route="unitRelationTable">物流相关表</a></li>',
                    ].join('');

                    $('.breadcrumb li:first').after(breads);
                    $('.header span').text('2.1 ');
                }

                if (slp.nonFlowIntension.length) {
                    // select nonFlowIntension
                    $.each(slp.nonFlowIntension, function (i, obj) {
                        var tr = tpls.nonFLowIntensionTbodyX(obj.id, i + 1, obj.pair, obj.level, obj.reason, slp.units, slp.reasons);
                        rows.push(tr);
                    });

                    $('#nonFlowIntension tbody').html(rows);
                    utils.addTooltipsEffects();
                    $('#nonFlowIntension button[data-route="nonFlowRelationTable"]').removeClass('disabled');

                } else {
                    // create nonFlowIntension
                    var tempUnits = $.extend([], slp.units);
                    var unitsLength = slp.units.length;
                    var index = 1;

                    $.each(slp.units, function (i, obj) {
                        if (unitsLength !== i + 1) {
                            tempUnits.shift();

                            $.each(tempUnits, function (j, tmpObj) {
                                var tr = tpls.nonFLowIntensionTbody(index, obj, tmpObj, slp.reasons);
                                rows.push(tr);
                                index++;
                            });
                        }
                    });

                    $('#nonFlowIntension tbody').html(rows);
                    utils.addTooltipsEffects();
                }
            });
            break;

        // 从至表
        case 'fromToTable':
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units);
            $('#fromToTable table thead').html(thead);
            $('#fromToTable table tbody').html(tbody);

            utils.setFromToTableData(slp.crafts);
            slp.fromToTableData = utils.getFromToTableData();

            break;

        // 物流强度表
        case 'flowIntensionTable':
            var flowIntension = slp.flowIntension = utils.getFlowIntesion(slp.fromToTableData);

            $.each(flowIntension, function (i, obj) {
                var tr = tpls.flowIntensionTbody(i + 1, obj.id, obj.intension, obj.level);
                rows.push(tr);
            });

            $('#flowIntensionTable table tbody').html(rows);
            break;

        // 作业单位物流相关表
        case 'unitRelationTable':
            if (slp.analysisType === 'together') {
                $('button[data-route="comprehensiveCloseness"]').attr('data-route', 'nonFlowIntension').text('作业单位相互关系分析');
            }
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#unitRelationTable table thead').html(thead);
            $('#unitRelationTable table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.flowIntension);
            utils.setTdColor();
            slp.unitRelation = utils.getUnitRelationTableData();

            break;

        // 作业单位非物流相关表
        case 'nonFlowRelationTable':
            if (slp.analysisType === 'together') {
                var breads = [
                    '<li><a href="#" data-route="fromToTable">从至表</a></li>',
                    '<li><a href="#" data-route="flowIntensionTable">物流强度表</a></li>',
                    '<li><a href="#" data-route="unitRelationTable">物流相关表</a></li>',
                    '<li><a href="#" data-route="nonFlowIntension">相互关系分析</a></li>',
                ].join('');
                var confirmWeightBtn = $('<button class="btn btn-primary" data-route="confirmWeight">确定权重</button>');

                $('.breadcrumb li:first').after(breads);
                $('.header span').text('2.2 ');
                $('#unitRelationTable table').after(confirmWeightBtn);
            }
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#unitRelationTable table thead').html(thead);
            $('#unitRelationTable table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.nonFlowIntension, 'true');
            utils.setTdColor();
            break;

        // 综合相互关系计算表
        case 'calComprehensiveRelation':
            $('#title').text('物流关系与非物流关系的权重为' + slp.weight);
            slp.comprehensiveRelation = utils.calComprehensiveRelation(slp.unitRelation, slp.nonFlowIntension, slp.weight);

            if (slp.weight === '1:0') {
                $.each(slp.comprehensiveRelation, function (i, obj) {
                    var target = _.find(slp.unitRelation, {id: obj.pair});
                    obj.level = target.level;
                });
            } else if (slp.weight === '0:1') {
                $.each(slp.comprehensiveRelation, function (i, obj) {
                    var target = _.find(slp.nonFlowIntension, {pair: obj.pair});
                    obj.level = target.level;
                });
            }

            $.each(slp.comprehensiveRelation, function (i, obj) {
                var tr = tpls.calComprehensiveRelationTbody(obj.index, obj.pair, obj.flowLevel, obj.flowScore, obj.nonFlowLevel, obj.nonFlowScore, obj.totalScore, obj.level);
                rows.push(tr);
            });

            $('#calComprehensiveRelation table tbody').html(rows);

            break;

        // 综合相互关系表
        case 'comprehensiveRelationTable':
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#comprehensiveRelationTable table thead').html(thead);
            $('#comprehensiveRelationTable table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.comprehensiveRelation, 'true');
            utils.setTdColor();

            break;

        // 综合接近程度
        case 'comprehensiveCloseness':
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#comprehensiveCloseness table thead').html(thead);
            $('#comprehensiveCloseness table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.flowIntension);
            utils.setAnotherData(slp.unitRelation);
            utils.setTdColor();
            slp.fullRelation = utils.getFullRelationData();
            utils.addRelationLevelScore(slp.fullRelation);
            slp.unitCloseness = utils.calculateUnitCloseness();

            var unitRelationClosenessTpls = tpls.unitRelationCloseness(slp.unitCloseness);
            var unitRelationSortTpls = tpls.unitRelationSort(slp.unitCloseness);
            $('#comprehensiveCloseness table tbody').append(unitRelationClosenessTpls);
            $('#comprehensiveCloseness table tbody').append(unitRelationSortTpls);

            break;

        // 关系工作表
        case 'relationWorkTable':
            $.each(slp.units, function (i, obj) {
                var tr = tpls.relationWorkTbody(i + 1, obj.name);
                rows.push(tr);
            });

            $('#relationWorkTable table tbody').html(rows);
            utils.setRelationWorkData(slp.fullRelation);
            slp.totalUnitRelation = utils.getRelationWorkData();

            break;

        // 位置关系图
        case 'unitPositionTable':
            tbody = tpls.unitPositionTable();
            $('#unitPositionTable tbody').html(tbody);

            slp.unitPosition = utils.calculateUnitPosition(slp.unitCloseness, slp.totalUnitRelation);
            utils.setUnitPosition(slp.unitPosition, slp.units);
            utils.addTooltipsEffects();
            break;

        // 查看结果
        case 'resultOnly':
            tbody = tpls.unitPositionTable();
            $('#unitPositionTable tbody').html(tbody);
            $('#unitPositionTable span#remark').text(slp.result.remark);

            var resultList = slp.result.position.split(', ');
            var resultFinal = utils.parseResultToJSON(resultList);
            utils.setUnitPosition(resultFinal, slp.units);
            utils.addTooltipsEffects();
            break;
        }
    });
});

// 处理登录
$(document).on('click', 'button#loginBtn', function (e) {
    var inputUsername = $('form#login #username').val();
    var inputPassword = $('form#login #password').val();

    db.get('SELECT * FROM User WHERE username = $username', {
        $username: inputUsername
    }, function (err, user) {
        if (!user) {
            alert('该用户不存在!');
            return e.preventDefault();
        } else if (user.password !== inputPassword) {
            alert('用户名或密码错误!');
            return e.preventDefault();
        } else {
            slp.user = user;
            emitter.emit('routeChange', 'factory');
            return e.preventDefault();
        }
    });
    return e.preventDefault();
});

// 处理登出
$(document).on('click', 'button#logoutBtn', function (e) {
    slp = {};

    emitter.emit('routeChange', 'login');

    return e.preventDefault();
});

// 处理工厂编辑部分
$(document).on('click', 'button#editFactoryBtn', function (e) {
    var data = utils.getFormData('#editFactory');   

    if (data.action === 'add') {
        db.run('INSERT INTO Factory(user_id, name, remark) VALUES($userId, $name, $remark)', {
            $userId: slp.user.id,
            $name: data.name,
            $remark: data.remark
        });
    } else {
        db.run('UPDATE Factory SET name = $name, remark = $remark WHERE id = $id', {
            $id: data.id,
            $name: data.name,
            $remark: data.remark
        });
    }

    emitter.emit('routeChange', 'factory');
    return e.preventDefault();
});

// 删除工厂
$(document).on('click', 'button[data-action="deleteFactory"]', function (e) {
    var row = $(this).parents('tr');
    var data = utils.getRowData(row);

    if (confirm('你确定要删除这工厂吗？')) {
        db.run('DELETE FROM Factory WHERE id = $id', {
            $id: data.id
        });
        db.run('DELETE FROM Unit WHERE factory_id = $factory_id', {
            $factory_id: data.id
        });
        db.run('DELETE FROM Part WHERE factory_id = $factory_id', {
            $factory_id: data.id
        });
        db.run('DELETE FROM Craft WHERE factory_id = $factory_id', {
            $factory_id: data.id
        });

        emitter.emit('routeChange', 'factory');
    }

    return e.preventDefault();
});

// 处理作业单位编辑部分
$(document).on('click', 'button#editUnitBtn', function (e) {
    var data = utils.getFormData('#editUnit');   

    if (data.action === 'add') {
        db.run('INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES($factoryId, $name, $num, $usage, $remark)', {
            $factoryId: data.factoryId,
            $name: data.name,
            $num: data.num,
            $usage: data.usage,
            $remark: data.remark
        });
    } else {
        db.run('UPDATE Unit SET factory_id = $factoryId, name = $name, num = $num, usage = $usage, remark = $remark WHERE id = $id', {
            $id: data.id,
            $factoryId: data.factoryId,
            $name: data.name,
            $num: data.num,
            $usage: data.usage,
            $remark: data.remark
        });
    }

    emitter.emit('routeChange', 'unit');
    return e.preventDefault();
});

// 删除作业单位
$(document).on('click', 'button[data-action="deleteUnit"]', function (e) {
    var row = $(this).parents('tr');
    var data = utils.getRowData(row);

    if (confirm('你确定要删除这个单位？')) {
        db.run('DELETE FROM Unit WHERE id = $id', {
            $id: data.id
        });

        emitter.emit('routeChange', 'unit');
    }

    return e.preventDefault();
});

// 处理零件编辑部分
$(document).on('click', 'button#editPartBtn', function (e) {
    var data = utils.getFormData('#editPart');   

    if (data.action === 'add') {
        db.run('INSERT INTO Part(factory_id, name, remark) VALUES($factoryId, $name, $remark)', {
            $factoryId: data.factoryId,
            $name: data.name,
            $remark: data.remark
        });
    } else {
        db.run('UPDATE Part SET factory_id = $factoryId, name = $name, remark = $remark WHERE id = $id', {
            $id: data.id,
            $factoryId: data.factoryId,
            $name: data.name,
            $remark: data.remark
        });
    }

    emitter.emit('routeChange', 'part');
    return e.preventDefault();
});

// 删除零件
$(document).on('click', 'button[data-action="deletePart"]', function (e) {
    var row = $(this).parents('tr');
    var data = utils.getRowData(row);

    if (confirm('你确定要删除这个单位？')) {
        db.run('DELETE FROM Part WHERE id = $id', {
            $id: data.id
        });

        emitter.emit('routeChange', 'part');
    }

    return e.preventDefault();
});

// 处理工艺编辑部分
$(document).on('click', 'button#editCraftBtn', function (e) {
    var data = utils.getFormData('#editCraft');   

    if (data.action === 'add') {
        db.run('INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES($factoryId, $partId, $route, $carrying, $remark)', {
            $factoryId: data.factoryId,
            $partId: data.partId,
            $route: data.route,
            $carrying: data.carrying,
            $remark: data.remark
        });
    } else {
        db.run('UPDATE Craft SET factory_id = $factoryId, part_id = $partId, route = $route, carrying = $carrying, remark = $remark WHERE id = $id', {
            $id: data.id,
            $factoryId: data.factoryId,
            $partId: data.partId,
            $route: data.route,
            $carrying: data.carrying,
            $remark: data.remark
        });
    }

    emitter.emit('routeChange', 'craft');
    return e.preventDefault();
});

// 处理非物流原因
$(document).on('click', 'button#editNonFlowReasonBtn', function (e) {
    var data = utils.getFormData('#editNonFlowReason');   

    if (data.action === 'add') {
        db.run('INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES($factoryId, $num, $reason)', {
            $factoryId: data.factoryId,
            $num: data.num,
            $reason: data.reason
        });
    } else {
        db.run('UPDATE NonlogisticsReason SET factory_id = $factoryId, num = $num, reason = $reason WHERE id = $id', {
            $id: data.id,
            $factoryId: data.factoryId,
            $num: data.num,
            $reason: data.reason
        });
    }

    emitter.emit('routeChange', 'nonFlowReason');
    return e.preventDefault();
});

// 删除零件
$(document).on('click', 'button[data-action="deleteReason"]', function (e) {
    var row = $(this).parents('tr');
    var data = utils.getRowData(row);

    if (confirm('你确定要删除这个单位？')) {
        db.run('DELETE FROM NonlogisticsReason WHERE id = $id', {
            $id: data.id
        });

        emitter.emit('routeChange', 'nonFlowReason');
    }

    return e.preventDefault();
});

// 删除工艺
$(document).on('click', 'button[data-action="deleteCraft"]', function (e) {
    var row = $(this).parents('tr');
    var data = utils.getRowData(row);

    if (confirm('你确定要删除这个单位？')) {
        db.run('DELETE FROM Craft WHERE id = $id', {
            $id: data.id
        });

        emitter.emit('routeChange', 'craft');
    }

    return e.preventDefault();
});

// 保存布局结果
$(document).on('click', 'button[data-action="saveResult"]', function (e) {
    var remark = $('#saveResult input#remark').val();

    db.get('SELECT * FROM Result WHERE factory_id = $factoryId', {
        $factoryId: slp.factory.id
    }, function (err, result) {
        if (!result) {
            db.run('INSERT INTO Result(factory_id, position, remark) VALUES($factoryId, $position, $remark)', {
                $factoryId: slp.factory.id,
                $position: utils.parseResultToString(slp.unitPosition),
                $remark: remark
            });
        } else {
            db.run('UPDATE Result SET position = $position, remark = $remark WHERE factory_id = $factoryId', {
                $position: utils.parseResultToString(slp.unitPosition),
                $remark: remark,
                $factoryId: slp.factory.id
            });
        }

        $('#saveResult').modal('hide');

        return e.preventDefault();
    });
});

// 保存非物流信息
$(document).on('click', 'button[data-action="saveNonFlow"]', function (e) {
    var rowsData = [];
    var rows = $('#nonFlowIntension tbody tr');
    $.each(rows, function (i, row) {
        var data = {};
        var tds = $(row).find('td');
        data.id = tds.eq(0).text();
        data.pair = tds.eq(2).text();
        data.level = tds.eq(3).find('select').val();
        data.reason = tds.eq(4).find('select').val();

        rowsData.push(data);
    });

    if (!slp.nonFlowIntension.length) {
        // insert
        $.each(rowsData, function (i, data) {
            db.run('INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES($factoryId, $pair, $level, $reason)', {
                $factoryId: slp.factory.id,
                $pair: data.pair,
                $level: data.level,
                $reason: data.reason
            });
        });
    } else {
        // update
        $.each(rowsData, function (i, data) {
            db.run('UPDATE Nonlogistics SET pair = $pair, level = $level, reason = $reason WHERE id = $id', {
                $id: data.id,
                $pair: data.pair,
                $level: data.level,
                $reason: data.reason
            });
        });
    }
    alert('保存成功！');
    emitter.emit('routeChange', 'nonFlowIntension');

    return e.preventDefault();
});

// 删除非物流信息表
$(document).on('click', 'button[data-action="deleteNonFLow"]', function (e) {
    if (confirm('你确定要删除全部记录？')) {
        db.run('DELETE FROM Nonlogistics WHERE factory_id = $factoryId', {
            $factoryId: slp.factory.id
        });

        emitter.emit('routeChange', 'nonFlowIntension');
    }

    return e.preventDefault();
});

$(document).on('click', 'button[data-action="confirmWeight"]', function (e) {
    var weight = $('#confirmWeight input[type="radio"]:checked').val();
    slp.weight = weight;

    emitter.emit('routeChange', 'calComprehensiveRelation');

    return e.preventDefault();
});

$(document).on('click', 'button[data-action="togetherAnalysis"]', function (e) {
    slp.analysisType = 'together';

    emitter.emit('routeChange', 'fromToTable');

    return e.preventDefault();
});

});

