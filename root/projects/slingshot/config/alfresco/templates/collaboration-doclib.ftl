<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head> 
      <title>${title}</title> 
      <#include "util/site-css-head.ftl"/>
      <#include "util/site-js-head.ftl"/>
      ${head}
   </head>
   <body class="yui-skin-sam">
      <@region id="header" scope="global" protected=true/>
      <@region id="title" scope="template" protected=true />
      <@region id="navigation" scope="template" protected=true />
      <div class="site-content">
         <@region id="doclib" scope="page"/>
      </div>
      <@region id="footer" scope="global" protected=true />
      <@region id="fileupload" scope="page"/>
   </body>
</html>