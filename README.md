TODO应用  --易计划
========
使用的技术介绍
--------
前端:NEJ+flex<br/>
后台：nodeJs+express<br/>
数据库：mongoDB<br/>

>其中删除了data目录（数据库所在）

实现的功能
--------
1. 用户注册和登陆功能。
2. 数据同步：允许用户离线操作，采用localStorage存储；当用户登录时更新数据库。<br/>
   该功能可以根据情况自由完善：<br/>
   1）在同一设备登录多个账户时，不同账户的数据同步；<br/>
   2）同一账户在不同设备上修改时，数据同步的问题。<br/>
   3）...
3. 分短期/长期记录两类。
4. 分页：采用分页进行展示。
5. 增加：回车添加记录/同时记录创建时间。
6. 查询：采用迷糊匹配的方法查询短期/长期中相关的记录。
7. 修改：双击记录进行编辑修改。
8. 置顶：可以将优先级较高的记录置顶操作。
9. 删除
10. 将记录由未完成的状态勾选为已完成。

可能出现的问题
--------
谷歌和搜狐浏览器浏览正常。<br/>
由于采用ES6语法，部分360浏览器会报错；<span style='color:red'>`（只要将箭头函数()=>{}改为function形式即可，暂时不改了）`</span>
