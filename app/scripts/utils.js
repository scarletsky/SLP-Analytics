module.exports = function ($, _) {

    function getRowData(row) {
        var data = {};
        var siblings = row.find('td[data-klass]');
        $.each(siblings, function (i, td) {
            data[$(td).data('klass')] = $(td).text();
        }); 

        return data;
    }

    function getFormData(formId) {
        var data = {};
        var fields = $(formId + ' input, ' + formId + ' textarea, ' + formId + ' select');

        $.each(fields, function (i, field) {
            // dom object to jQuery object
            var field = $(field);
            data[field.attr('name')] = field.val();
        });

        return data;
    }

    function getFromToTableData() {
        var data = [];
        var tds = $('#fromToTable table td[id]');
        $.each(tds, function (i, td) {
            var obj = {};
            obj.id = $(td).attr('id');
            obj.intension = parseFloat($(td).text());
            data.push(obj);
        });

        return data;
    }

    function setFromToTableData(crafts) {
        $.each(crafts, function (i, craft) {
            var route = craft.route.split(',');
            var routeLength = route.length;

            $.each(route, function (j, r) {
                if (routeLength !== j + 1) {
                    var fromId = route[j];
                    var toId = route[j + 1];
                    var tdId = fromId + '-' + toId;
                    var tdNum = parseFloat($('table td#' + tdId).text());
                    $('table td#' + tdId).text(tdNum + craft.carrying);
                }
            });
        });
    }

    function getFlowIntesion(inputData) {
        var data = [];
        $.each(inputData, function (i, d) {
            var obj = {};

            if (parseFloat(d.intension) !== 0) {
                var sepId = d.id.split('-');

                if (parseInt(sepId[0]) < parseInt(sepId[1])) {
                    obj.id = d.id;
                    obj.intension = d.intension;
                    data.push(obj);
                } else {
                    var reverseId = sepId[1] + '-' + sepId[0];
                    var target = _.find(data, {id: reverseId});
                    target.intension += d.intension;
                }
            }
        });

        return data;
    }

    return {
        getRowData: getRowData,
        getFormData: getFormData,
        getFromToTableData: getFromToTableData,
        setFromToTableData: setFromToTableData,
        getFlowIntesion: getFlowIntesion
    };
}

