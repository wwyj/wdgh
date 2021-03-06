<%--
  Created by IntelliJ IDEA.
  User: lh
  Date: 2014/9/28
  Time: 11:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>下载中心</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/info/~/scripts/downloadCenter.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">下载中心</div>
        <div class="SR_moduleRight">
            <div>
                <a class="btn_add" href="javascript:void(0);" onclick="addNotice()" title="">添加附件</a>
            </div>
        </div>
    </div>
    <!--标题和一些页面功能的工具条End-->
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <form id="searchForm" name="searchForm" onsubmit="rdcp.grid.reload('RoleGrid');return false;" method="post">
                <input type="hidden" name="info_type" value="download"/>
                <div class="barquerycontent">
                    <table>
                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;">
                                信息标题:
                            </td>
                            <td>
                                <input type="text" name="title" class="inputText"  style="width: 180px;"/>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                信息内容:
                            </td>
                            <td>
                                <input type="text" name="content" class="inputText" style="width: 180px;"/>
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="rdcp.grid.reload('listdt');return false;"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
    </div>
    <!-- 搜索表头结束 -->

    <!-- 电表查询列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>
    <div id="uploadDlg" style="display:none;">
      <div align="center">
         <div class="SR_searchTableBox">
              <form id="notice_form" name="notice_form">
                  <input type="hidden" id="notice_id" name="notice_id"/>
                  <input type="hidden" id="file_id" name="file_id"/>
                  <input type="hidden" id="info_type" name="info_type" value="download"/>
                  <table>
                    <tr>
                      <td class="SR_searchTitle">标题：</td>
                      <td><input type="text" id="title" name="title"/></td>
                    </tr>
                  </table>
                  <div id="uploader"></div>
              </form>
         </div>
      </div>
    </div>
</div>
</body>
</html>
