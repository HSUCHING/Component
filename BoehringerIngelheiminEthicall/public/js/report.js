/**
 * Created by chinghsu on 16/12/2.
 */
/* Custom filtering function which will search data in column four between two values */
var allTable;

$(document).ready(function($) {
    initialData();
    initDatePicker();
});

function initialData() {
    //日报
    $('#dailyTable').DataTable({
        dom: "",
        data: [
            ["12312", "412", "433", "1233", "44"]
        ],
        columns: [{
            title: "拜访数"
        }, {
            title: "拜访医生数"
        }, {
            title: "新增医生数"
        }, {
            title: "医生阅读文献"
        }, {
            title: "医生点评文献"
        }]
    });
    //周报
    $('#weeklyTable').DataTable({
        dom: "",
        data: [
            ["223", "1111", "22", "123333", "1234"]
        ],
        columns: [{
            title: "拜访数"
        }, {
            title: "拜访医生数"
        }, {
            title: "新增医生数"
        }, {
            title: "医生阅读文献"
        }, {
            title: "医生点评文献"
        }]
    });

    allTable = $('#allTable').DataTable({
        dom: "<'row'<'col-sm-5'l><'col-sm-7'Tf>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
        ajax: "../json/tableData0.json",
        columns: [{
            title: "姓名"
        }, {
            title: "代理商"
        }, {
            title: "上级"
        }, {
            title: "拜访时间"
        }, {
            title: "产品"
        }, {
            title: "医生"
        }, {
            title: "医生级别"
        }, {
            title: "所属医院"
        }, {
            title: "科室"
        }, {
            title: "文献名"
        }, {
            title: "时长"
        }, {
            title: "点评时间"
        }]
    });

    //筛选日期算法
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var min = $('.startDate').val();
            var max = $('.endDate').val();
            var date = data[4]; // use data for the date column
            if ((!(min) && !(max)) ||
                (!(min) && date <= max) ||
                (min <= date && !(max)) ||
                (min <= date && date <= max)) {
                return true;
            }
            return false;
        }
    );
    //筛选按钮
    $('#ToolTables_allTable_1,#ZeroClipboard_TableToolsMovie_2').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(event);
        //当前在日报视图
        if ($('.daily-toggle').hasClass('active')) {
            $('.selecTime').addClass('hide');
        } else {
            $('.selecTime').removeClass('hide');
        }
        $('#myModal').modal();
    })
}

function initDatePicker() {
    var options = {
        format: 'YYYY-MM-DD', //日期格式化，只显示日期
        locale: 'zh-CN' //中文化
        // maxDate: '2017-01-01', //最大日期
        // minDate: '2010-01-01' //最小日期
    };
    $('#startDatePicker,#endDatePicker').datetimepicker(options);
}

function filterData() {
    allTable.draw();
}
