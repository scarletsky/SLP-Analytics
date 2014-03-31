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

var craft = function (id, part_id, route, carrying, remark) {
    var html = [
        '<tr data-klass="craft">' +
            '<td class="text-center" data-klass="id">' + id + '</td>',
            '<td class="text-center" data-klass="part_id">' + part_id + '</td>',
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

exports.factory = factory;
exports.unit = unit;
exports.part = part;
exports.craft = craft;
