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

var part = function (id, code, name, remark) {
    var html = [
        '<tr data-klass="part">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="code">' + code + '</td>',
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


var flowIntensionTbody = function (index, id, intension, level) {
    var html = [
        '<tr>',
            '<td>' + index + '</td>',
            '<td>' + id + '</td>',
            '<td>' + intension + '</td>',
            '<td>' + level + '</td>',
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
exports.fromToThead = fromToThead;
exports.fromToTbody = fromToTbody;
exports.flowIntensionTbody = flowIntensionTbody;
exports.unitRelationCloseness = unitRelationCloseness;
exports.unitRelationSort = unitRelationSort;
exports.relationWorkTbody = relationWorkTbody;
exports.unitPositionTable = unitPositionTable;
