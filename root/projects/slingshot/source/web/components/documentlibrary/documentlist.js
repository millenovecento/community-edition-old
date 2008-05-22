/*

YAHOO.util.Dom.get("template.documentlist.documentlibrary-full-body").clientWidth

*/


/*
 *** Alfresco.DocumentList
*/
(function()
{
   Alfresco.DocumentList = function(htmlId)
   {
      this.name = "Alfresco.DocumentList";
      this.id = htmlId;
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["button", "menu", "container", "datasource", "datatable", "history"], this.onComponentsLoaded, this);
      
      return this;
   }
   
   Alfresco.DocumentList.prototype =
   {
      options:
      {
         showFolders: true,
         initialPath: ""
      },
      
      currentPath: "",
      fileUpload: null,

      setOptions: function(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);
      },
      
      onComponentsLoaded: function()
      {
         YAHOO.util.Event.onContentReady(this.id, this.onReady, this, true);
         
         // Patch for width and/or minWidth Column values bug in non-scrolling DataTables
         (function(){var B=YAHOO.widget.DataTable,A=YAHOO.util.Dom;B.prototype._setColumnWidth=function(I,D,J){I=this.getColumn(I);if(I){J=J||"hidden";if(!B._bStylesheetFallback){var N;if(!B._elStylesheet){N=document.createElement("style");N.type="text/css";B._elStylesheet=document.getElementsByTagName("head").item(0).appendChild(N)}if(B._elStylesheet){N=B._elStylesheet;var M=".yui-dt-col-"+I.getId();var K=B._oStylesheetRules[M];if(!K){if(N.styleSheet&&N.styleSheet.addRule){N.styleSheet.addRule(M,"overflow:"+J);N.styleSheet.addRule(M,"width:"+D);K=N.styleSheet.rules[N.styleSheet.rules.length-1]}else{if(N.sheet&&N.sheet.insertRule){N.sheet.insertRule(M+" {overflow:"+J+";width:"+D+";}",N.sheet.cssRules.length);K=N.sheet.cssRules[N.sheet.cssRules.length-1]}else{B._bStylesheetFallback=true}}B._oStylesheetRules[M]=K}else{K.style.overflow=J;K.style.width=D}return }B._bStylesheetFallback=true}if(B._bStylesheetFallback){if(D=="auto"){D=""}var C=this._elTbody?this._elTbody.rows.length:0;if(!this._aFallbackColResizer[C]){var H,G,F;var L=["var colIdx=oColumn.getKeyIndex();","oColumn.getThEl().firstChild.style.width="];for(H=C-1,G=2;H>=0;--H){L[G++]="this._elTbody.rows[";L[G++]=H;L[G++]="].cells[colIdx].firstChild.style.width=";L[G++]="this._elTbody.rows[";L[G++]=H;L[G++]="].cells[colIdx].style.width="}L[G]="sWidth;";L[G+1]="oColumn.getThEl().firstChild.style.overflow=";for(H=C-1,F=G+2;H>=0;--H){L[F++]="this._elTbody.rows[";L[F++]=H;L[F++]="].cells[colIdx].firstChild.style.overflow=";L[F++]="this._elTbody.rows[";L[F++]=H;L[F++]="].cells[colIdx].style.overflow="}L[F]="sOverflow;";this._aFallbackColResizer[C]=new Function("oColumn","sWidth","sOverflow",L.join(""))}var E=this._aFallbackColResizer[C];if(E){E.call(this,I,D,J);return }}}else{}};B.prototype._syncColWidths=function(){var J=this.get("scrollable");if(this._elTbody.rows.length>0){var M=this._oColumnSet.keys,C=this.getFirstTrEl();if(M&&C&&(C.cells.length===M.length)){var O=false;if(J&&(YAHOO.env.ua.gecko||YAHOO.env.ua.opera)){O=true;if(this.get("width")){this._elTheadContainer.style.width="";this._elTbodyContainer.style.width=""}else{this._elContainer.style.width=""}}var I,L,F=C.cells.length;for(I=0;I<F;I++){L=M[I];if(!L.width){this._setColumnWidth(L,"auto","visible")}}for(I=0;I<F;I++){L=M[I];var H=0;var E="hidden";if(!L.width){var G=L.getThEl();var K=C.cells[I];if(J){var N=(G.offsetWidth>K.offsetWidth)?G.firstChild:K.firstChild;if(G.offsetWidth!==K.offsetWidth||N.offsetWidth<L.minWidth){H=Math.max(0,L.minWidth,N.offsetWidth-(parseInt(A.getStyle(N,"paddingLeft"),10)|0)-(parseInt(A.getStyle(N,"paddingRight"),10)|0))}}else{if(K.offsetWidth<L.minWidth){E=K.offsetWidth?"visible":"hidden";H=Math.max(0,L.minWidth,K.offsetWidth-(parseInt(A.getStyle(K,"paddingLeft"),10)|0)-(parseInt(A.getStyle(K,"paddingRight"),10)|0))}}}else{H=L.width}if(L.hidden){L._nLastWidth=H;this._setColumnWidth(L,"1px","hidden")}else{if(H){this._setColumnWidth(L,H+"px",E)}}}if(O){var D=this.get("width");this._elTheadContainer.style.width=D;this._elTbodyContainer.style.width=D}}}this._syncScrollPadding()}})();
         // Patch for initial hidden Columns bug
         (function(){var A=YAHOO.util,B=YAHOO.env.ua,E=A.Event,C=A.Dom,D=YAHOO.widget.DataTable;D.prototype._initTheadEls=function(){var X,V,T,Z,I,M;if(!this._elThead){Z=this._elThead=document.createElement("thead");I=this._elA11yThead=document.createElement("thead");M=[Z,I];E.addListener(Z,"focus",this._onTheadFocus,this);E.addListener(Z,"keydown",this._onTheadKeydown,this);E.addListener(Z,"mouseover",this._onTableMouseover,this);E.addListener(Z,"mouseout",this._onTableMouseout,this);E.addListener(Z,"mousedown",this._onTableMousedown,this);E.addListener(Z,"mouseup",this._onTableMouseup,this);E.addListener(Z,"click",this._onTheadClick,this);E.addListener(Z.parentNode,"dblclick",this._onTableDblclick,this);this._elTheadContainer.firstChild.appendChild(I);this._elTbodyContainer.firstChild.appendChild(Z)}else{Z=this._elThead;I=this._elA11yThead;M=[Z,I];for(X=0;X<M.length;X++){for(V=M[X].rows.length-1;V>-1;V--){E.purgeElement(M[X].rows[V],true);M[X].removeChild(M[X].rows[V])}}}var N,d=this._oColumnSet;var H=d.tree;var L,P;for(T=0;T<M.length;T++){for(X=0;X<H.length;X++){var U=M[T].appendChild(document.createElement("tr"));P=(T===1)?this._sId+"-hdrow"+X+"-a11y":this._sId+"-hdrow"+X;U.id=P;for(V=0;V<H[X].length;V++){N=H[X][V];L=U.appendChild(document.createElement("th"));if(T===0){N._elTh=L}P=(T===1)?this._sId+"-th"+N.getId()+"-a11y":this._sId+"-th"+N.getId();L.id=P;L.yuiCellIndex=V;this._initThEl(L,N,X,V,(T===1))}if(T===0){if(X===0){C.addClass(U,D.CLASS_FIRST)}if(X===(H.length-1)){C.addClass(U,D.CLASS_LAST)}}}if(T===0){var R=d.headers[0];var J=d.headers[d.headers.length-1];for(X=0;X<R.length;X++){C.addClass(C.get(this._sId+"-th"+R[X]),D.CLASS_FIRST)}for(X=0;X<J.length;X++){C.addClass(C.get(this._sId+"-th"+J[X]),D.CLASS_LAST)}var Q=(A.DD)?true:false;var c=false;if(this._oConfigs.draggableColumns){for(X=0;X<this._oColumnSet.tree[0].length;X++){N=this._oColumnSet.tree[0][X];if(Q){L=N.getThEl();C.addClass(L,D.CLASS_DRAGGABLE);var O=D._initColumnDragTargetEl();N._dd=new YAHOO.widget.ColumnDD(this,N,L,O)}else{c=true}}}for(X=0;X<this._oColumnSet.keys.length;X++){N=this._oColumnSet.keys[X];if(N.resizeable){if(Q){L=N.getThEl();C.addClass(L,D.CLASS_RESIZEABLE);var G=L.firstChild;var F=G.appendChild(document.createElement("div"));F.id=this._sId+"-colresizer"+N.getId();N._elResizer=F;C.addClass(F,D.CLASS_RESIZER);var e=D._initColumnResizerProxyEl();N._ddResizer=new YAHOO.util.ColumnResizer(this,N,L,F.id,e);var W=function(f){E.stopPropagation(f)};E.addListener(F,"click",W)}else{c=true}}}if(c){}}else{}}for(var a=0,Y=this._oColumnSet.keys.length;a<Y;a++){if(this._oColumnSet.keys[a].hidden){var b=this._oColumnSet.keys[a];var S=b.getThEl();b._nLastWidth=S.offsetWidth-(parseInt(C.getStyle(S,"paddingLeft"),10)|0)-(parseInt(C.getStyle(S,"paddingRight"),10)|0);this._setColumnWidth(b.getKeyIndex(),"1px")}}if(B.webkit&&B.webkit<420){var K=this;setTimeout(function(){K._elThead.style.display=""},0);this._elThead.style.display="none"}}})();
      },
   
      onReady: function()
      {
         var Dom = YAHOO.util.Dom,
            Event = YAHOO.util.Event;

         var myThis = this;
         
         // Decoupled event listeners
         YAHOO.Bubbling.on("onDoclistPathChanged", this.onDoclistPathChanged, this);
         YAHOO.Bubbling.on("onDoclistRefresh", this.onDoclistRefresh, this);
      
         // YUI History
         var bookmarkedPath = YAHOO.util.History.getBookmarkedState("path");
         this.currentPath = bookmarkedPath || this.options.initialPath;
         if ((this.currentPath.length > 0) && (this.currentPath[0] != "/"))
         {
            this.currentPath = "/" + this.currentPath;
         }

         // Register History Manager path update callback
         YAHOO.util.History.register("path", "", function(newPath)
         {
            this._updateDocList.call(this, newPath);
         }, null, this);

         // Initialize the browser history management library
         try
         {
             YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
         }
         catch (e)
         {
             /*
              * The only exception that gets thrown here is when the browser is
              * not supported (Opera, or not A-grade)
              */
         }
         
         /* File Select Button */
         var fsButton = Dom.get(this.id + "-fileSelect-button");
         var fsMenu = Dom.get(this.id + "-fileSelect-menu");
         var fileSelectButton = new YAHOO.widget.Button(fsButton,
         {
            type: "menu", 
            menu: fsMenu
         });
         fileSelectButton.getMenu().subscribe("click", this.onFileSelectButtonClick, this, true);
         
         /* Show the Upload button if a FileUpload component has registered on the page */
         /*
         var fileUploads = Alfresco.util.ComponentManager.find({name:"Alfresco.module.FileUpload"});
         if (fileUploads.length > 0)
         {
            this.fileUpload = fileUploads[0];
            var fuButton = Dom.get(this.id + "-fileUpload-button");
            var fileUploadButton = new YAHOO.widget.Button(fuButton,
            {
               type: "button"
            });
            fileUploadButton.on("click", this.onFileUploadButtonClick, this);
            var fuButtonWrap = Dom.get(this.id + "-fileUpload-buttonWrap");
            Dom.removeClass(fuButtonWrap, "hiddenComponents");
         }
         */

         var fileUploadButton = new YAHOO.widget.Button(this.id + "-fileUpload-button", {type: "button"});
         fileUploadButton.subscribe("click", this.onFileUploadButtonClick, this, true);

         /* Hide/Show Folders button */
         var sfButton = Dom.get(this.id + "-showFolders-button");
         var showFoldersButton = new YAHOO.widget.Button(sfButton,
         {
            type: "button"
         });
         showFoldersButton.on("click", this.onShowFoldersButtonClick, this);

         /* Folder Up Navigation button */
         var fuButton = Dom.get(this.id + "-folderUp-button");
         var folderUpButton = new YAHOO.widget.Button(fuButton,
         {
            type: "button"
         });
         folderUpButton.on("click", this.onFolderUpButtonClick, this);
         
         
         /* DataTable Prototyping */
         this.formatThumbnail = function(elCell, oRecord, oColumn, sData)
         {
            elCell.innerHTML = "<img src=\"" + Alfresco.constants.URL_CONTEXT + oRecord.getData("icon32").substring(1) + "\" />";
         };
         this.formatDescription = function(elCell, oRecord, oColumn, sData)
         {
            var desc = "";
            if (oRecord.getData("type") == "folder")
            {
               var newPath = myThis.currentPath + "/" + oRecord.getData("name");

               // TODO: *** Update the onclick to be logically-bound, not via HTML
               desc = "<p><a href=\"\" onclick=\"YAHOO.Bubbling.fire('onDoclistPathChanged', {path: '" + newPath.replace(/'/g, "\'") + "'}); return false;\"><b>" + oRecord.getData("name") + "</b></a></p>"

            }
            else
            {
               desc = "<p><b>" + oRecord.getData("name") + "</b></p><p>Description: La la la</p>";
            }
            elCell.innerHTML = desc;
         };
         this.formatActions = function(elCell, oRecord, oColumn, sData)
         {
            elCell.innerHTML = "Actions here";
         };

         var myColumnDefs =
         [
            {
               key: "icon32", label: "Preview", sortable: false, formatter: this.formatThumbnail, width: 128
            },
            {
               key: "name", label: "Description", sortable: false, formatter: this.formatDescription
            },
            {
               key: "actions", label: "Actions", sortable: false, formatter: this.formatActions, width: 256
            }
         ];

         var uriDoclist = Alfresco.constants.PROXY_URI + "slingshot/doclib/doclist?";
         this.myDataSource = new YAHOO.util.DataSource(uriDoclist);
         this.myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
         this.myDataSource.connXhrMode = "queueRequests";
         this.myDataSource.responseSchema =
         {
             resultsList: "doclist.items",
             fields: ["nodeRef", "type", "icon16", "icon32", "name", "status", "description"]
         };

         var dlDataTable = Dom.get(this.id + "-documents");
         this.myDataTable = new YAHOO.widget.DataTable(dlDataTable, myColumnDefs, this.myDataSource,
         {
            renderLoopSize: 5,
            initialRequest: "path=" + encodeURIComponent(this.currentPath)
         });
         
         YAHOO.Bubbling.fire('onDoclistPathChanged',
         {
            path: this.currentPath
         });
         
         Dom.setStyle(this.id + "-body", "visibility", "visible");
      },
      
      onFileSelectButtonClick: function(type, args)
      {
         if (type == "click")
         {
            var domEvent = args[0]
            var eventTarget = args[1];
            alert(eventTarget.value);
         }
      },

      onFileUploadButtonClick: function(e, obj)
      {
         if(!this.fileUpload)
         {
            this.fileUpload = new Alfresco.module.FileUpload(obj.id + "-createSite");
         }
         var showConfig2 = {
            title: "Upload New Version of Alfresco Logo.rtf",
            filter: [{description:"Documents", extensions:"*.doc"}],
            multiSelect: false,
            noOfVisibleRows: 1,
            versionInput: true
         };
         // Use something like this for multi uploads
         var showConfig = {
            title: "Upload new files",
            filter: [{description:"Documents", extensions:"*.doc"}],
            multiSelect: true,
            noOfVisibleRows: 5,
            versionInput: false
         }
         this.fileUpload.show(showConfig);
      },
      
      onShowFoldersButtonClick: function(e, obj)
      {
         obj.options.showFolders = !obj.options.showFolders;
         this.set("label", (obj.options.showFolders ? "Hide Folders" : "Show Folders"));

         YAHOO.Bubbling.fire('onDoclistRefresh');
         YAHOO.util.Event.preventDefault(e);
      },
      
      onFolderUpButtonClick: function(e, obj)
      {
         var newPath = obj.currentPath.substring(0, obj.currentPath.lastIndexOf("/"));
         YAHOO.Bubbling.fire('onDoclistPathChanged',
         {
            path: newPath
         });
         YAHOO.util.Event.preventDefault(e);
      },
      
      onDoclistPathChanged: function(layer, args)
      {
         var obj = args[1];
         if ((obj !== null) && (obj.path !== null))
         {
            try
            {
               YAHOO.util.History.navigate("path", obj.path);
            }
            catch (e)
            {
               obj._updateDocList.call(obj, obj.path);
            }
         }
      },
      
      onDoclistRefresh: function(layer, args)
      {
         var obj = args[1];
         if (obj !== null)
         {
            obj._updateDocList.call(obj, obj.currentPath);
         }
      },
   
      _updateDocList: function(path)
      {
         function successHandler(sRequest, oResponse, oPayload)
         {
            this.currentPath = path;
            this.myDataTable.onDataReturnReplaceRows.call(this.myDataTable, sRequest, oResponse, oPayload);
         }
         
         this.myDataSource.sendRequest("path=" + encodeURIComponent(path) + (this.options.showFolders ? "" : "&type=documents"),
         {
               success: successHandler,
               failure: null,
               scope: this
         });
      }

   };
})();
