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

    function getUnitRelationTableData() {
        var data = [];
        var tds = $('#unitRelationTable table td[id]');
        $.each(tds, function (i, td) {
            var obj = {};
            var td = $(td);
            if (td.text()) {
                obj.id = td.attr('id');
                obj.level = td.text();
                data.push(obj);
            }
        });

        return data;
    }

    function setUnitRelationTableData(intension) {
        $.each(intension, function (i, obj) {
            $('table td#' + obj.id).text(obj.level);
        });

        $('table td[id]').each(function (i, td) {
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

                if (counter === lvMap.count) {
                    counter = 0;
                    break;
                }

                var newObj = sortByIntension.shift();
                newObj.level = lvMap.level;
                newSortList.push(newObj);
                counter++;
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

    function setAnotherData(inputData) {
        $.each(inputData, function (i, d) {
            var sepId = d.id.split('-');
            var reverseId = sepId[1] + '-' + sepId[0];
            $('table td[id=\"' + reverseId + '\"]').text(d.level);
        });
    }

    function getFullRelationData() {
        var data = [];
        var tds = $('table td[id]');
        $.each(tds, function (i, td) {
            var obj = {};
            var td = $(td);
            if (td.text()) {
                obj.id = td.attr('id');
                obj.level = td.text();
                data.push(obj);
            }
        });

        return data;
    }

    function addRelationLevelScore(inputData) {
        var levelMap = {
            'A': '4',
            'E': '3',
            'I': '2',
            'O': '1',
            'U': '0',
            'X': '-1'
        };

        $.each(inputData, function (i, d) {
            var td = $('table td[id=\"' + d.id + '\"]');
            var level = td.text();
            td.html(level + ' / <span class="score">' + levelMap[level] + '</span>');
        });
    }

    function calculateUnitCloseness() {
        var data = [];
        var trs = $('table tbody tr');
        $.each(trs, function (i, tr) {
            var obj = {
                index: i + 1,
                score: 0
            };
            var tds = $(tr).find('td');

            $.each(tds, function (j, td) {
                var td = $(td);

                if (td.attr('id') && td.text()) {
                    var score = parseInt(td.find('span.score').text());
                    obj.score += score;
                }
            });

            data.push(obj);
        });

        function _sortUnitCloseness(data) {
            var sortData = _.sortBy(data, 'score').reverse();
            return sortData.map(function (d, i) {
                d.sort = i + 1;

                return d;
            });
        }

        return _sortUnitCloseness(data);
    }

    return {
        getRowData: getRowData,
        getFormData: getFormData,
        getFromToTableData: getFromToTableData,
        setFromToTableData: setFromToTableData,
        getFlowIntesion: getFlowIntesion,
        getUnitRelationTableData: getUnitRelationTableData,
        setUnitRelationTableData: setUnitRelationTableData,
        setAnotherData: setAnotherData,
        getFullRelationData: getFullRelationData,
        addRelationLevelScore: addRelationLevelScore,
        calculateUnitCloseness: calculateUnitCloseness
    };
};

