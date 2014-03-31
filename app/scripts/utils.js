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
        var fields = $(formId + ' input, ' + formId + ' textarea');

        $.each(fields, function (i, field) {
            // dom object to jQuery object
            var field = $(field);
            data[field.attr('name')] = field.val();
        });

        return data;
    }

    return {
        getRowData: getRowData,
        getFormData: getFormData
    };
}

