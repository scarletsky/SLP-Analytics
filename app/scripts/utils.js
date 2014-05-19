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

    function setTdColor() {
        var colorMap = {
            'A': 'red',
            'E': 'yellow',
            'I': 'green',
            'O': 'blue'
        };

        $('table td').each(function (i, td) {
            var td = $(td);
            var text = td.text();
            var firstText = text ? text.substring(0, 1) : '';

            if (colorMap.hasOwnProperty(firstText)) {
                td.addClass(colorMap[firstText])
            }
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

    function setUnitRelationTableData(intension, type) {
        if (!type) {
            $.each(intension, function (i, obj) {
                $('table td#' + obj.id).text(obj.level);
            });
        } else {
            $.each(intension, function (i, obj) {
                $('table td#' + obj.pair).text(obj.level);
            });
        }

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

    function getRelationWorkData() {
        var data = [];
        var trs = $('#relationWorkTable tbody tr');
        $.each(trs, function (i, tr) {
            var obj = {index: i + 1};
            var tr = $(tr);
            var tds = tr.find('td[id]');

            $.each(tds, function (j, td) {
                var td = $(td);
                var sepId = td.attr('id').split('-');
                var tdText = td.text();

                if (tdText) {
                    obj[sepId[1]] = tdText.split(',');
                }
            });

            data.push(obj);
        });

        return data;
    }

    function setRelationWorkData(fullRelation) {
        $.each(fullRelation, function (i, obj) {
            var sepId = obj.id.split('-');
            var targetId = sepId[0] + '-' + obj.level;
            var target = $('td[id=\"' + targetId + '\"]');
            var targetText = target.text();

            if (!targetText) {
                target.text(sepId[1]);
            } else {
                target.text(targetText + ',' + sepId[1]);
            }
        });
    }

    // 作业单位位置关系图
    function getCenterPositionId() {
        var rowsLength = $('#unitPositionTable tbody tr').length;
        var centerNum = Math.round(rowsLength / 2);
        return centerNum + '-' + centerNum;
    }

    // 获取 A 级关系位置
    function getALevenPositionId(hostId) {
        var sepId = hostId.split('-');

        var upId = parseInt(sepId[0]) + '-' + (parseInt(sepId[1]) - 1);
        var downId = parseInt(sepId[0]) + '-' + (parseInt(sepId[1]) + 1);
        var leftId = (parseInt(sepId[0]) - 1) + '-' + parseInt(sepId[1]);
        var rightId = (parseInt(sepId[0]) + 1) + '-' + parseInt(sepId[1]);

        var result = [upId, downId, leftId, rightId];

        return result;
    }

    // 获取 E 级关系位置
    function getELevelPositionId(hostId) {
        var sepId = hostId.split('-');

        var leftUpId = (parseInt(sepId[0]) - 1) + '-' + (parseInt(sepId[1]) - 1);
        var leftDownId = (parseInt(sepId[0]) - 1) + '-' + (parseInt(sepId[1]) + 1);
        var rightUpId = (parseInt(sepId[0]) - 1) + '-' + (parseInt(sepId[1]) - 1);
        var rightDownId = (parseInt(sepId[0]) + 1) + '-' + (parseInt(sepId[1]) + 1);

        var result = [leftUpId, leftDownId, rightUpId, rightDownId];

        return result;
    }

    // 获取外一层的位置
    function getOutsidePositionId(hostId) {
        var sepId = hostId.split('-');

        var id1 = (parseInt(sepId[0]) - 2) + '-' + (parseInt(sepId[1]) - 2);
        var id2 = (parseInt(sepId[0]) - 1) + '-' + (parseInt(sepId[1]) - 2);
        var id3 = (parseInt(sepId[0])) + '-' + (parseInt(sepId[1]) - 2);
        var id4 = (parseInt(sepId[0]) + 1) + '-' + (parseInt(sepId[1]) - 2);
        var id5 = (parseInt(sepId[0]) + 2) + '-' + (parseInt(sepId[1]) - 2);

        var id6 = (parseInt(sepId[0]) - 2) + '-' + (parseInt(sepId[1]) - 1);
        var id7 = (parseInt(sepId[0]) + 2) + '-' + (parseInt(sepId[1]) - 1);

        var id8 = (parseInt(sepId[0]) - 2) + '-' + (parseInt(sepId[1]));
        var id9 = (parseInt(sepId[0]) + 2) + '-' + (parseInt(sepId[1]));

        var id10 = (parseInt(sepId[0]) - 2) + '-' + (parseInt(sepId[1]) + 1);
        var id11 = (parseInt(sepId[0]) + 2) + '-' + (parseInt(sepId[1]) + 1);

        var id12 = (parseInt(sepId[0]) - 2) + '-' + (parseInt(sepId[1]) + 2);
        var id13 = (parseInt(sepId[0]) - 1) + '-' + (parseInt(sepId[1]) + 2);
        var id14 = (parseInt(sepId[0])) + '-' + (parseInt(sepId[1]) + 2);
        var id15 = (parseInt(sepId[0]) + 1) + '-' + (parseInt(sepId[1]) + 2);
        var id16 = (parseInt(sepId[0]) + 2) + '-' + (parseInt(sepId[1]) + 2);

        var result = [id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, id11, id12, id13, id14, id15, id16];

        return result;
    }

    function getRandomPositionId(hostId, level, dataRefer) {
        var result, positionIds, randomId;

        switch(level) {
            case 'A':
                positionIds = getALevenPositionId(hostId);
                break;
            case 'E':
                positionIds = getELevelPositionId(hostId);
                break;
            default:
                positionIds = getOutsidePositionId(hostId);
        }

        for (var i = 0, len = positionIds.length; i <= len; i++) {
            randomId = _.sample(positionIds);

            if (!randomId) break;

            if (_.find(dataRefer, {id: randomId})) {
                var index = positionIds.indexOf(randomId);
                positionIds.splice(index, 1);
            } else {
                result = randomId;
                break;
            }
        }

        return result;
    }

    function getUnitPositionId(hostId, level, dataRefer) {
        var result;

        if (level === 'A') {
            result = getRandomPositionId(hostId, 'A', dataRefer);
        } else if (level === 'E' || !result) {
            result = getRandomPositionId(hostId, 'E', dataRefer);
        } else {
            result = getRandomPositionId(hostId, 'Outside', dataRefer);
        }

        return result;
    }

    function calculateUnitPosition(unitCloseness, totalUnitRelation) {
        var hostId, lastHostId;
        var data = [];
        var levelMap = ['A', 'E', 'I', 'O', 'U', 'X'];

        function _getUnitPositionId(hostId) {
            var _outputId;
            var AlevelPosition = getALevenPositionId(hostId);
            var ElevelPosition = getELevelPositionId(hostId);
            var OutsidePosition = getOutsidePositionId(hostId);

            $.each(AlevelPosition, function (i, id) {
                if (_.find(data, {id: id})) {
                    return;
                } else {
                    _outputId = id;
                    return false;
                }
            });

            if (!_outputId) {
                $.each(ElevelPosition, function (i, id) {
                    if (_.find(data, {id: id})) {
                        return;
                    } else {
                        _outputId = id;
                        return false;
                    }
                });
            }

            if (!_outputId) {
                $.each(OutsidePosition, function (i, id) {
                   if (_.find(data, {id: id})) {
                        return;
                    } else {
                        _outputId = id;
                        return false;
                    }
                });
            }

            return _outputId;
        }

        $.each(unitCloseness, function (i, obj) {
            var outputObj = {};
            var target = _.find(totalUnitRelation, {index: obj.index});

            // 第一次循环
            if (i === 0) {
                hostId = getCenterPositionId();
                outputObj.id = hostId;
                outputObj.index = obj.index;
                data.push(outputObj);

            } else {

                if (!_.find(data, {index: obj.index})) {
                    hostId = _getUnitPositionId(lastHostId);
                    outputObj.id = hostId;
                    outputObj.index = obj.index;
                    data.push(outputObj);
                }
            }

            $.each(['A', 'E'], function (j, level) {
                var relatedObj = {};
                if (!target.hasOwnProperty(level)) {
                    return;
                } else {
                    var relatedUnits = target[level];

                    $.each(relatedUnits, function (k, unitIndex) {
                        if (_.find(data, {index: parseInt(unitIndex)})) {
                            return;
                        } else {
                            relatedObj.index = parseInt(unitIndex);
                            relatedObj.id = getUnitPositionId(hostId, level, data);
                            data.push(relatedObj);
                        }
                    });
                }
            });

            lastHostId = hostId;

        });

        return data;
    }

    function setUnitPosition(unitPosition, units) {
        $.each(unitPosition, function (i, obj) {
            var targetUnit = _.find(units, {num: obj.index});
            var html = '<a href="#" data-toggle="tooltip" ' + 
                           'title=\"' + targetUnit.name + '\">' + obj.index + '</a>';

            $('td#' + obj.id).html(html);
        });
    }

    function parseResultToString(result) {
        var output = '';
        var len = result.length;

        $.each(result, function (i, obj) {
            output += JSON.stringify(obj);

            if (len !== i + 1) {
                output += ', '
            }
        });

        return output;
    }

    function parseResultToJSON(result) {
        var output = [];

        $.each(result, function (i, obj) {
            output.push(JSON.parse(obj));
        });

        return output;
    }

    function addTooltipsEffects() {
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
        calculateUnitCloseness: calculateUnitCloseness,
        getRelationWorkData: getRelationWorkData,
        setRelationWorkData: setRelationWorkData,
        calculateUnitPosition: calculateUnitPosition,
        setUnitPosition: setUnitPosition,
        setTdColor: setTdColor,
        parseResultToString: parseResultToString,
        parseResultToJSON: parseResultToJSON,
        addTooltipsEffects: addTooltipsEffects
    };
};

