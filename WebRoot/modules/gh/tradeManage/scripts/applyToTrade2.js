
rdcp.ready(function(){
    rdcp.request("!gh/tradeManage/~query/Q_LOAD_TRADE_PARAM_CODE",{},function(data){
        var p = data.body.rows;
        for(var i=0;i<p.length;i++){
            var html = "<option value='"+p[i].CODE_NUM+"'>"+p[i].NAME+"</option>";
            $("#"+p[i].CODE).append(html);
        }
/*        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_TRADE_APPLY_INFO", {"load_type":option,"apply_id":apply_id}, function (data) {
           if(option=="add")
               $("#btn_submit").show();
           if(option=="view") {
               $("#audit_div1").show();
               $("#audit_div2").show();
               $("#is_agree").attr("checked", "checked");
           }
        });*/
/*        if(option=="view") {
            rdcp.request("!gh/tradeManage/~query/Q_LOAD_TRADE_APPLY_AUDIT_LIST", {"apply_id": apply_id}, function (data) {
                var rows = data.body.rows;
                $("#span_handleHistory").append("<p>&nbsp;&nbsp;处理人-[处理时间]-处理环节-处理结果-处理意见</p>");
                for (var i = 0; i < rows.length; i++) {
                    var html = "<p>&nbsp;&nbsp;" + rows[i].cell[0] + "</p>";
                    $("#span_handleHistory").append(html);
                }
            });
        }*/
        // rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_TRADE_INFO", {"account":account}, function (data) {
        rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_APPLY_INFO", {"apply_id":apply_id}, function (data) {//方案1
            // rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_TRADE_INFO_2", {"apply_id":apply_id}, function (data) {//方案2
        });
    });
});

function submit(){
    var total = 0;

    if(total>0) return;
    var flag = $("#is_agree").attr("checked");
    if(flag!="checked"){
        $.messager.alert("提示","请勾选同意《中华全总工会入会申请书》!",'info');
        return;
    }
    if(option=="add"){
        $("#apply_type").val(0);
        rdcp.form.submit("trade_form", {
            url: "!gh/tradeManage/~query/Q_ADD_TRADE_APPLY" ,
            success: function (data) {
                $.messager.alert('提示', '入会申请提交成功，请等待审核结果！', 'info',function () {
                    cancel();
                });
            }
        }, {"mask": true});
    }else if(option=="edit"){
        $("#apply_type").val(0)
        $("#apply_id").val(apply_id)
        // alert(apply_id)
        rdcp.form.submit("trade_form", {
            url: "!gh/tradeManage/~query/Q_AUDIT_APPLY_2" ,
            success: function (data) {
                $.messager.alert('提示', '修改入会申请信息提交成功，请等待审核结果！', 'info',function () {
                    cancel2();
                });
            }
        }, {"mask": true});
    }
}
function cancel(){

    if(option=="add")
        CloseTab("applyToTrade", "申请入会");
    else if(option=="edit")
        CloseTab("editTradeInfo", "编辑会籍信息");
}

function cancel2(){

    if(option=="add")
        CloseTab("applyToTrade", "申请入会");
    else if(option=="edit")
        CloseTab("editTradeInfo", "修改入会申请");
}
