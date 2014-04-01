module.exports = function ($) {

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

    function setTableData(crafts) {
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

    return {
        getRowData: getRowData,
        getFormData: getFormData,
        setTableData: setTableData
    };
}

