/* 即时更新 */
var Gaze = require('gaze').Gaze;
var gaze = new Gaze('**/*');

gaze.on('all', function (event, filepath) {
    if (location) {
        location.reload();
    }
});

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
            db.all('SELECT * FROM Unit WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getUnits'));

            db.all('SELECT * FROM Part WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getParts'));

            db.all('SELECT * FROM Craft WHERE factory_id = $factoryId', {
                $factoryId: slp.factory.id
            }, ep.done('getCrafts'));

            ep.all('getUnits', 'getParts', 'getCrafts', function (units, parts, crafts) {
                slp.units = units;
                slp.parts = parts;
                slp.crafts = crafts;

                if (units.length && parts.length && crafts.length) {
                    $('#manageFactory #flowBtn').removeClass('disabled');
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

        // 作业单位相互关系
        case 'unitRelationTable':
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#unitRelationTable table thead').html(thead);
            $('#unitRelationTable table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.flowIntension);
            utils.setTdColor();
            slp.unitRelation = utils.getUnitRelationTableData();

            break;

        // 综合相互关系
        case 'comprehensiveRelation':
            thead = tpls.fromToThead(slp.units);
            tbody = tpls.fromToTbody(slp.units, 'dataEmpty');
            $('#comprehensiveRelation table thead').html(thead);
            $('#comprehensiveRelation table tbody').html(tbody);

            utils.setUnitRelationTableData(slp.flowIntension);
            utils.setAnotherData(slp.unitRelation);
            utils.setTdColor();
            slp.fullRelation = utils.getFullRelationData();
            utils.addRelationLevelScore(slp.fullRelation);
            slp.unitCloseness = utils.calculateUnitCloseness();

            var unitRelationClosenessTpls = tpls.unitRelationCloseness(slp.unitCloseness);
            var unitRelationSortTpls = tpls.unitRelationSort(slp.unitCloseness);
            $('#comprehensiveRelation table tbody').append(unitRelationClosenessTpls);
            $('#comprehensiveRelation table tbody').append(unitRelationSortTpls);

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
        case 'unitPositionTable':
            tbody = tpls.unitPositionTable();
            $('#unitPositionTable tbody').html(tbody);

            slp.unitPosition = utils.calculateUnitPosition(slp.unitCloseness, slp.totalUnitRelation);
            utils.setUnitPosition(slp.unitPosition, slp.units);

            $('td').hover(function (e) {
                var hasText = $(this).text();

                if (hasText) {
                    $(this).find('a').tooltip('show');
                }
            }, function (e) {
                var hasText = $(this).text();

                if (hasText) {
                    $(this).find('a').tooltip('hide');
                }
            });
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


});

