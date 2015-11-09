/*! supertable - v1.0.0
* Copyright (c) helinjiang;*/

/**
 * [文件描述]
 *
 * @author helinjiang
 * @date 2015/11/9
 */
window.HE = {};

if (!window.console) {
    window.console = {
        log: function () {
        },
        info: function () {
        },
        error: function () {
        }
    };
};
/**
 * [文件描述]
 *
 * @author linjianghe
 * @date 2015/11/9
 */
(function (global, HE, undefined) {
    //实例化编辑器
    //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
    var ue = UE.getEditor('editor', {
        toolbars: [
            ['fullscreen', 'source', '|', 'cleardoc', 'drafts'],
            ['inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols',]
        ],
        autoHeightEnabled: false,
        autoFloatEnabled: false
    });

    /**
     * 插入示例的html代码
     */
    HE.insertHtml = function () {
        var arr = ['f1', 'f2', 'f3', 'f4', 'f5'],
            length = arr.length,
            trCount = 8,
            tableArr = [];

        tableArr.push('<tr><td>f1</td><td>f2</td><td>f3</td><td>f4</td><td>f5</td></tr>');

        for (var i = 0; i < trCount; i++) {
            var tmpArr = [];
            tmpArr.push('<tr>');
            for (var j = 0; j < length; j++) {
                tmpArr.push('<td>' + i + j + '</td>');
            }
            tmpArr.push('</tr>');

            tableArr.push(tmpArr.join(''));
        }
        ue.execCommand('insertHtml', '<table>' + tableArr.join('') + '</table>');
    };

    HE.getDataArray = function () {
        var superTable = new SuperTable(ue.getContent(), 1, 0, 0);
        var json = superTable.getDataArray();

        console.log(json);

        // 展现结果
        _showResult(JSON.stringify(json));
    };

    HE.getDataMap = function () {
        var superTable = new SuperTable(ue.getContent(), 1, 0, 0);
        var json = superTable.getDataMap();

        console.log(json);

        // 展现结果
        _showResult(JSON.stringify(json));
    };

    function _showResult(msg) {
        $("#result").val(msg).select();
    }

})(window, window.HE);