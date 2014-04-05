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

    function setUnitRelationTableData(intension) {
        $.each(intension, function (i, obj) {
            $('table td#' + obj.id).text(obj.level);
        });

        $('#unitRelationTable table td[id]').each(function (i, td) {
            var tdId = $(td).attr('id');
            var sepId = tdId.split('-');
            var fromId = sepId[0];
            var toId = sepId[1];

            if (parseInt(fromId) < parseInt(toId) && !$(td).text()) {
                $(td).text('U');
            }
        });
    }

    function getFlowIntensionLevel(inputData) {
        var dataLength = inputData.length;
        var aNum = Math.round(dataLength * 0.1);
        var eNum = Math.round(dataLength * 0.2);
        var iNum = Math.round(dataLength * 0.3);
        var oNum = dataLength - aNum - eNum - iNum;

        var levelMap = (function (aNum, eNum, iNum, oNum) {
            var data = [];
            data.push({count: aNum, level: 'A'});
            data.push({count: eNum, level: 'E'});
            data.push({count: iNum, level: 'I'});
            data.push({count: oNum, level: 'O'});

            return data;
        })(aNum, eNum, iNum, oNum);

        var sortByIntension = _.sortBy(inputData, 'intension').reverse();
        var newSortList = [];

        $.each(levelMap, function (i, lvMap) {
            var counter = 0;

            for (var j = 0; j <= dataLength; j++) {
                var newObj = sortByIntension.shift()
                newObj.level = lvMap.level;
                newSortList.push(newObj);
                counter++;

                if (counter === lvMap.count) {
                    counter = 0;
                    break;
                }
            }
        });

        return newSortList;

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
                    if (target) {
                        target.intension += d.intension;
                    } else {
                        obj.id = reverseId;
                        obj.intension = d.intension;
                        data.push(obj);
                    }
                }
            }
        });

        return getFlowIntensionLevel(data);
    }

    return {
        getRowData: getRowData,
        getFormData: getFormData,
        getFromToTableData: getFromToTableData,
        setFromToTableData: setFromToTableData,
        getFlowIntesion: getFlowIntesion,
        setUnitRelationTableData: setUnitRelationTableData
    };
}

