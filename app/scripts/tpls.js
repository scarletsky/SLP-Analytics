var $ = require('jquery');
var _ = require('lodash');

var factory = function (id, name, remark) {
    var html = [
        '<tr data-klass="factory">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="name">' + name + '</td>',
            '<td class="text-center" data-klass="remark">' + remark + '</td>',
            '<td class="text-center">',
                '<button class="btn btn-sm btn-default u-marginRs" data-action-type="edit" data-route="editFactory">',
                    '编辑',
                '</button>',

                '<button class="btn btn-sm btn-primary u-marginRs" data-action-type="manage" data-route="manageFactory">',
                    '管理',
                '</button>',

                '<button class="btn btn-sm btn-danger u-marginRs" data-action-type="delete" data-action="deleteFactory">',
                    '删除',
                '</button>',
            '</td>',
        '</tr>',
    ]

    return html.join('');
}

var unit = function (id, num, name, usage, remark) {
    var html = [
        '<tr data-klass="unit">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="num">' + num + '</td>',
            '<td class="text-center" data-klass="name">' + name + '</td>',
            '<td class="text-center" data-klass="usage">' + usage + '</td>',
            '<td class="text-center" data-klass="remark">' + remark + '</td>',
            '<td class="text-center">',
                '<button class="btn btn-sm btn-default u-marginRs" data-action-type="edit" data-route="editUnit">',
                    '编辑',
                '</button>',

                '<button class="btn btn-sm btn-danger u-marginRs" data-action-type="delete" data-action="deleteUnit">',
                    '删除',
                '</button>',
            '</td>',
        '</tr>',
    ]

    return html.join('');
}

var part = function (id, name, remark) {
    var html = [
        '<tr data-klass="part">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="name">' + name + '</td>',
            '<td class="text-center" data-klass="remark">' + remark + '</td>',
            '<td class="text-center">',
                '<button class="btn btn-sm btn-default u-marginRs" data-action-type="edit" data-route="editPart">',
                    '编辑',
                '</button>',

                '<button class="btn btn-sm btn-danger u-marginRs" data-action-type="delete" data-action="deletePart">',
                    '删除',
                '</button>',
            '</td>',
        '</tr>',
    ]

    return html.join('');
}

var craft = function (id, part_id, name, route, carrying, remark) {
    var html = [
        '<tr data-klass="craft">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="part_id">' + part_id + '</td>',
            '<td class="text-center" data-klass="name">' + name + '</td>',
            '<td class="text-center" data-klass="route">' + route + '</td>',
            '<td class="text-center" data-klass="carrying">' + carrying + '</td>',
            '<td class="text-center" data-klass="remark">' + remark + '</td>',
            '<td class="text-center">',
                '<button class="btn btn-sm btn-default u-marginRs" data-action-type="edit" data-route="editCraft">',
                    '编辑',
                '</button>',

                '<button class="btn btn-sm btn-danger u-marginRs" data-action-type="delete" data-action="deleteCraft">',
                    '删除',
                '</button>',
            '</td>',
        '</tr>',
    ]

    return html.join('');
}

var nonFlowReason = function (id, num, reason) {
    var html = [
        '<tr data-klass="reason">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="num">' + num + '</td>',
            '<td class="text-center" data-klass="reason">' + reason + '</td>',
            '<td class="text-center">',
                '<button class="btn btn-sm btn-default u-marginRs" data-action-type="edit" data-route="editNonFlowReason">',
                    '编辑',
                '</button>',

                '<button class="btn btn-sm btn-danger u-marginRs" data-action-type="delete" data-action="deleteReason">',
                    '删除',
                '</button>',
            '</td>',
        '</tr>',
    ]

    return html.join('');
}

var craftPartOption = function (id, name) {
    return '<option value=\"' + id + '\">' + name + '</option>'
}

var fromToThead = function (units) {
    var cols = '';
    var html = [
        '<tr>',
            '<th></th>',
        '</tr>'
    ];

    $.each(units, function (i, unit) {
        cols += '<th>' + unit.name + '</th>'
    });
    html[2] = cols;

    return html.join('');
}

var fromToTbody = function (units, dataEmpty) {
    var html;
    var data = dataEmpty ? '' : 0;

    $.each(units, function (i, unit) {
        html += '<tr><td>' + unit.name + '</td>';

        $.each(units, function (j, unit) {
            html += '<td id=\"' + (i + 1) + '-' + (j + 1) + '\">' + data + '</td>';
        });

        html += '</tr>';
    });

    return html;
}

var unitRelationCloseness = function (data) {
    var html = '<tr><td>综合接近程度</td>';
    var dataSortByIndex = _.sortBy(data, 'index');

    $.each(dataSortByIndex, function (i, d) {
        html += '<td>' + d.score + '</td>';
    });

    html += '</tr>';

    return html;
}

var unitRelationSort = function (data) {
    var html = '<tr><td>排序</td>';
    var dataSortByIndex = _.sortBy(data, 'index');

    $.each(dataSortByIndex, function (i, d) {
        html += '<td>' + d.sort + '</td>';
    });

    html += '</tr>';

    return html;
}


var flowIntensionTbody = function (index, id, intension, level, units) {
    var sepId = id.split('-');
    var masterUnit = _.find(units, {id: Number(sepId[0])});
    var slaveUnit = _.find(units, {id: Number(sepId[1])});

    var html = [
        '<tr>',
            '<td>' + index + '</td>',
            '<td>',
                '<a href="#" data-toggle="tooltip" ' + 
                            'title=\"' + masterUnit.name + ' - ' + slaveUnit.name + '\">' + masterUnit.num + '-' + slaveUnit.num + '</a>',
            '</td>',
            '<td>' + intension + '</td>',
            '<td>' + level + '</td>',
        '</tr>'
    ];

    return html.join('');
}

var reasonOptions = function (reasonNum, reasons) {
    var html = '';
    $.each(reasons, function (i, obj) {
        var isSelected = parseInt(reasonNum) === parseInt(obj.num) ? 'selected="selected"' : '';
        html += '<option value="' + obj.num + '" '+ isSelected + '">' + obj.reason + '</option>';
    });

    return html;
}

var nonFLowIntensionTbody = function (index, masterUnit, slaveUnit, reasons) {
    var html = [
        '<tr>',
            '<td></td>',
            '<td>' + index + '</td>',
            '<td>',
                '<a href="#" data-toggle="tooltip" ' + 
                            'title=\"' + masterUnit.name + ' - ' + slaveUnit.name + '\">' + masterUnit.num + '-' + slaveUnit.num + '</a>',
            '</td>',
            '<td>',
                '<select class="form-control">',
                    '<option val="A">A</option>',
                    '<option val="E">E</option>',
                    '<option val="I">I</option>',
                    '<option val="O">O</option>',
                    '<option val="U">U</option>',
                    '<option val="X">X</option>',
                '</select>',
            '</td>',
            '<td>',
                '<select class="form-control">',
                '</select>',
            '</td>',
        '</tr>'
    ];

    var options = reasonOptions(null, reasons);
    html.splice(18, 0, options);

    return html.join('');
}

var nonFLowIntensionTbodyX = function (id, index, pair, level, reasonNum, units, reasons) {
    var sepId = pair.split('-');
    var masterUnit = _.find(units, {id: Number(sepId[0])});
    var slaveUnit = _.find(units, {id: Number(sepId[1])});

    var html = [
        '<tr>',
            '<td>' + id + '</td>',
            '<td>' + index + '</td>',
            '<td>',
                '<a href="#" data-toggle="tooltip" ' + 
                            'title=\"' + masterUnit.name + ' - ' + slaveUnit.name + '\">' + masterUnit.num + '-' + slaveUnit.num + '</a>',
            '</td>',
            '<td>',
                '<select class="form-control">',
                    '<option val="A">A</option>',
                    '<option val="E">E</option>',
                    '<option val="I">I</option>',
                    '<option val="O">O</option>',
                    '<option val="U">U</option>',
                    '<option val="X">X</option>',
                '</select>',
            '</td>',
            '<td>',
                '<select class="form-control">',
                '</select>',
            '</td>',
        '</tr>'
    ];

    var options = reasonOptions(reasonNum, reasons);
    html.splice(18, 0, options);

    var index;
    switch (level) {
        case 'A':
            index = 8;
            break;
        case 'E':
            index = 9;
            break;
        case 'I':
            index = 10;
            break;
        case 'O':
            index = 11;
            break;
        case 'U':
            index = 12;
            break;
        case 'X':
            index = 13;
            break;
    }

    var ex = html[index].substring(0, 15);
    var ext = html[index].substring(15);
    html[index] = ex + 'selected="true"' + ext;

    return html.join('');
}

var calComprehensiveRelationTbody = function (index, pair, flowLevel, flowScore, nonFlowLevel, nonFlowScore, totalScore, level) {
    var html = [
        '<tr>',
            '<td>' + index + '</td>',
            '<td>' + pair + '</td>',
            '<td>' + flowLevel + '</td>',
            '<td>' + flowScore + '</td>',
            '<td>' + nonFlowLevel + '</td>',
            '<td>' + nonFlowScore + '</td>',
            '<td>' + totalScore + '</td>',
            '<td contenteditable="true">' + level + '</td>',
        '</tr>'
    ];

    return html.join('');
}

var relationWorkTbody = function (index, unit) {
    var html = [
        '<tr>',
            '<td>' + index + '. ' +  unit + '</td>',
            '<td id="'+ index + '-A"\"></td>',
            '<td id="'+ index + '-E"\"></td>',
            '<td id="'+ index + '-I"\"></td>',
            '<td id="'+ index + '-O"\"></td>',
            '<td id="'+ index + '-U"\"></td>',
        '</tr>'
    ];

    return html.join('');
}

var unitPositionTable = function () {
    var html = '';
    for(var i = 1; i <= 6; i++) {
        html += '<tr>';

        for(var j = 1; j <= 6; j++) {
            html += '<td id=\"' + i + '-' + j + '\" width="50" height="40"></td>'
        }

        html += '</tr>';
    }

    return html;
}

exports.factory = factory;
exports.unit = unit;
exports.part = part;
exports.craft = craft;
exports.craftPartOption = craftPartOption;
exports.nonFlowReason = nonFlowReason;
exports.fromToThead = fromToThead;
exports.fromToTbody = fromToTbody;
exports.flowIntensionTbody = flowIntensionTbody;
exports.nonFLowIntensionTbody = nonFLowIntensionTbody;
exports.nonFLowIntensionTbodyX = nonFLowIntensionTbodyX;
exports.calComprehensiveRelationTbody = calComprehensiveRelationTbody;
exports.unitRelationCloseness = unitRelationCloseness;
exports.unitRelationSort = unitRelationSort;
exports.relationWorkTbody = relationWorkTbody;
exports.unitPositionTable = unitPositionTable;
