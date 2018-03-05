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
   3）。。。<br/>
3. 分短期/长期记录两类（<B>使用了NEJ框架的JST模板</B>）。
4. <B>分页：</B>采用分页进行展示，默认每页展示4条记录。
5. <B>置顶：</B>可以将优先级较高的记录置顶操作。
6. 将记录由未完成的状态勾选为已完成。
7. 增加：回车添加记录/同时记录创建时间。
8. 查询：采用迷糊匹配的方法查询短期/长期中相关的记录。
9. 修改：双击记录进行编辑修改。
10. 删除


可能出现的问题
--------
谷歌和搜狐浏览器浏览正常；<br/>
由于采用ES6语法，部分360浏览器会出现解析出错的问题。<B style='color:red'>（这里主要使用了ES6的箭头函数和字符串的常用方法等，只要将其改为ES5语法即可，这里不改了）</B>
