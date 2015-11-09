/*! supertable - v1.0.0
* Copyright (c) helinjiang;*/

/**
 *
 * 基于jQuery的用来解析table标签的工具，并返回表格中的数据。支持两种方式：二维数组和对象数组。
 *
 * 1.目前只支持解析第一个table标签。
 * 2.配合在线编辑器之后，能够非常方便的处理excel中的数据了！详见docs下的示例。
 *
 * @author helinjiang
 * @date 2015/11/9
 */
(function (window, $, undefined) {
    /**
     * SuperTable类，获取table中的数据。
     * @param {String} htmlContent html代码，里面必须要有table标签
     * @param {Number} startRow 真实数据开始于表格第几行，从0开始计数，默认值为0
     * @param {Number} startCol 真实数据开始于表格第几列，从0开始计数，默认值为0
     * @param {Number} keyRow 如果要返回map型数据，则必须指定key值对应的是哪一列，从0开始计数，如果不指定则会自动生成key
     * @constructor
     */
    function SuperTable(htmlContent, startRow, startCol, keyRow) {
        this.htmlContent = htmlContent;
        this.startRow = startRow || 0;
        this.startCol = startCol || 0;
        this.keyRow = keyRow;

        /**
         * 从html源码中获得table的jQuery对象,
         * 注意此处要使用filter方法，不能用find，因为find是查后代元素，而此处是table本身以及一些p，因此要过滤而不是查找。
         */
        var htmlElem = $(this.htmlContent),
            tableElem = htmlElem.filter("table");
        if (!tableElem.length) {
            tableElem = htmlElem.find("table");
        }
        this.tableElem = tableElem.eq(0);
    }

    /**
     * 获得表格数据，最终返回一个二维数组，其中每一行就是这个二维数组的一个元素。
     * @returns {Array} 二维数组
     */
    SuperTable.prototype.getDataArray = function () {
        var trElemArr = this.tableElem.find("tr"),
            startRow = this.startRow,
            startCol = this.startCol,
            resultArr = [];

        // 解析每一个tr中的数据
        trElemArr.each(function (trIndex) {
            if (trIndex < startRow) {
                return;
            }

            var $thisTr = $(this),
                tdElemArr = $thisTr.children(),
                itemArr = [];

            tdElemArr.each(function (tdIndex) {
                if (tdIndex < startCol) {
                    return;
                }
                itemArr.push(getValue($(this).text()));
            });

            resultArr.push(itemArr);
        });

        console.log("表格一共有 %s 行，从行序号 %s 和列序号 %s 开始算，实际有 %s 条有效数据！", trElemArr.length, startRow, startCol, resultArr.length);

        return resultArr;
    };

    /**
     * 获得表格数据，最终返回一个对象数组，其中每个数组元素都是一个对象，value值即是表格中的值
     * @returns {Array} 对象数组
     */
    SuperTable.prototype.getDataMap = function () {
        var trElemArr = this.tableElem.find("tr"),
            startRow = this.startRow,
            startCol = this.startCol,
            keyRow = this.keyRow,
            resultArr = [],
            keyArr = [];

        // 获得key值数组，如果没有定义keyRow,则将自动生成一个数组
        if (typeof keyRow === "undefined") {
            console.error("keyRow is undefined!");

            var length = trElemArr.eq(0).children().length;
            for (var i = 0; i < length; i++) {
                keyArr.push('a' + i);
            }
        } else {
            var firstRowTdElem = trElemArr.eq(keyRow).children();

            firstRowTdElem.each(function (tdIndex) {
                if (tdIndex < startCol) {
                    return;
                }

                // 此处如果有部分未定义key，则自动生成一个
                var curKey = getValue($(this).text());
                if (curKey === '') {
                    curKey = 'a' + tdIndex;
                }
                keyArr.push(curKey);
            });
        }

        // 解析每一个tr中的数据
        trElemArr.each(function (trIndex) {
            if (trIndex < startRow) {
                return;
            }

            var $thisTr = $(this),
                tdElemArr = $thisTr.children(),
                itemMap = {};

            tdElemArr.each(function (tdIndex) {
                if (tdIndex < startCol) {
                    return;
                }
                itemMap[keyArr[tdIndex] + ""] = getValue($(this).text());
            });

            resultArr.push(itemMap);
        });

        console.log("表格一共有 %s 行，从行序号 %s 和列序号 %s 开始算，实际有 %s 条有效数据！", trElemArr.length, startRow, startCol, resultArr.length);
        return resultArr;
    };

    /**
     * 处理数据，去除前后空格、多个空格和换行符号等
     * @param {String} str 处理之前的字符串
     * @returns {String} 处理之后的字符串
     */
    function getValue(str) {
        return $.trim(str).replace(/\n\r/g, '').replace(/\s+/g, ' ');
    }

    // 提供给全局使用
    window.SuperTable = SuperTable;

})(window, window.jQuery);