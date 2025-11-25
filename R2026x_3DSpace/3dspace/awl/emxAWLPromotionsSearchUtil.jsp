<%-- 
   emxAWLPromotionsSearchUtil.jsp
   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program
   
   @author Bhupal L K (B1R)
   @since AWL 2012x.FD01
--%>
<%-- 
<%@page import="com.matrixone.apps.awl.util.Pair"%>
<%@page import="java.util.List"%>
<%@page import="com.matrixone.apps.awl.util.AWLUIUtil"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import="com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import="matrix.util.StringList"%>
<%@page import="com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.awl.util.Access"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.matrixone.apps.awl.dao.Promotion"%>
<%@page import="com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLRel"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLState"%>
<%@page import="com.matrixone.apps.awl.enumeration.AWLPolicy"%>
<%@page import="com.matrixone.apps.awl.dao.CPGProduct"%>
<%@page import="com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import="com.matrixone.apps.awl.util.AWLPropertyUtil"%>
<%@page import="com.matrixone.apps.domain.util.MapList"%>

<%
	String strMode = emxGetParameter(request, "mode");
try {
    StringBuilder gridBroserURL = new StringBuilder(200);
    gridBroserURL.append("../common/emxGridTable.jsp?");

        List<Pair<String, String>> gridBrosserArgs = new ArrayList<Pair<String, String>> ();
        gridBrosserArgs.add(new Pair(context, "header", "emxAWL.Heading.ArtworkMatrix"));
        gridBrosserArgs.add(new Pair(context, "mode", "edit"));
        gridBrosserArgs.add(new Pair(context, "flatView", "true"));
        gridBrosserArgs.add(new Pair(context, "editLink", "true"));
        gridBrosserArgs.add(new Pair(context, "suiteKey", "AWL"));
        gridBrosserArgs.add(new Pair(context, "StringResourceFileId", "emxAWLStringResource"));
        
        gridBrosserArgs.add(new Pair(context, "table", "AWLMCLPromotionArtworkElementsGridTable"));
        gridBrosserArgs.add(new Pair(context, "rowJPO", "AWLPromotionUI:getPromotionAssignmentMatrixElements"));
        gridBrosserArgs.add(new Pair(context, "colJPO", "AWLPromotionUI:getPromotionAssignmentMatrixMCLs"));
        gridBrosserArgs.add(new Pair(context, "cellRangeJPO", "AWLPromotionUI:getPromotionAssignmentMatrixRangeValues"));
        gridBrosserArgs.add(new Pair(context, "cellUpdateJPO", "AWLPromotionUI:updatePromotionAssignmentMatrixSelection"));
        
        gridBrosserArgs.add(new Pair(context, "cellValueStyle", 
        		AWLUtil.strcat(AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Include"), "|", 
        				       AWLPropertyUtil.getI18NString(context, "emxAWL.MCL.PromotionElements.Label.Include"), 
        				       "|background-color:rgb(142,229,246);"))); 
	
    if("GetSelectedFPIds".equalsIgnoreCase(strMode))
    {
        boolean showDialog = true;
        String strObjId = emxGetParameter(request,"objectId");
        String[] strSelectedFPIds = (String[])emxGetParameterValues(request,"emxTableRowId");
        String strParentId = emxGetParameter(request,"parentOID");
        
        String strSelectedFPId = "";
        String strTempId = "";
        String strTempIDs = "";
        String productId = "";
        String strAlertMessage = "";
        
        if (strSelectedFPIds != null && strSelectedFPIds.length != 0 )
        {       
            for(int i = 0 ; i < strSelectedFPIds.length ; i++){
                String strRowId = strSelectedFPIds[i];
                StringList slRow = FrameworkUtil.split(strRowId,"|");
                strTempId = slRow.get(1).toString();
                if(slRow.size()== 1)
                	productId = strParentId;   
                else
                	productId = slRow.get(1).toString();
                strTempIDs += strTempId+",";
                
                String slProductstype = BusinessUtil.getInfo(context,strTempId,"type.kindof["+AWLType.FP_MASTER.get(context)+"]");               
                if(slProductstype.contains("FALSE"))
                {
                  String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.SelectOnlyFPM");
                  throw new FrameworkException(strAlert);
                }
                
                DomainObject productObj = new DomainObject(productId);
                if("Obsolete".equalsIgnoreCase(productObj.getInfo(context,DomainConstants.SELECT_CURRENT))){
                    showDialog = false;
                    strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.PromotionalSearchForProductState.Alert");
%>
                    <script language="Javascript">
                    //XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N 
                        alert("<%=strAlertMessage%>");
                    </script>
                    <%
                    	break;
               }
               DomainObject FPMasterObj = new DomainObject(productId);
               if("Obsolete".equalsIgnoreCase(FPMasterObj.getInfo(context,DomainConstants.SELECT_CURRENT))){
                     showDialog = false;
                     strAlertMessage = AWLPropertyUtil.getI18NString(context, "emxAWL.PromotionalSearchForFPMasterState.Alert");
               %>
                    <script language="Javascript">
                  //XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N
                        alert("<%=strAlertMessage%>");
                    </script>
                    <%
                    	break;
               }
           }
       } else  {           
          strTempIDs = strParentId+",";
       }       
       strSelectedFPId = strTempIDs.substring(0 , strTempIDs.lastIndexOf(","));
       if(showDialog){
       		// suiteKey=awl is added to fix HelpMarker Issue
            String sURL = AWLUtil.strcat("../common/emxFullSearch.jsp?field=TYPES=type_PromotionalOption:CURRENT!=policy_PromotionalOption.state_Suspended,policy_PromotionalOption.state_Obsolete&table=AWLPromotionsSearchTable&suiteKey=AWL&formInclusionList=AWL_DISPLAY_NAME,description&selection=multiple&Submit=true&showInitialResults=true&HelpMarker=emxhelpassignpromotions&submitURL=../awl/emxAWLPromotionsSearchUtil.jsp?mode=AssignPromotions&objectId=",strObjId,"&emxFPRowID=",strSelectedFPId,"&parentOID=",strParentId);
       %>      
            <script language="Javascript">
                 showNonModalDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>",800,600,true,'',"Large");
            </script>
        <%
       }
    }else if("AssignPromotions".equalsIgnoreCase(strMode)){
          	Access.checkRequiredAccess(context,"FPMasterAssignPromotions");
            String strObjId = emxGetParameter(request,"objectId");
            String strParentId = emxGetParameter(request,"parentOID");
            String emxFPRowID = emxGetParameter(request,"emxFPRowID");      

            String[] strSelectedPromotionIds = (String[])emxGetParameterValues(request,"emxTableRowId");
            strSelectedPromotionIds = AWLUIUtil.getObjIdsFromRowIds(strSelectedPromotionIds);
            
            String strSelectedPromotionRowId = FrameworkUtil.join(strSelectedPromotionIds, ",");
            
            Promotion.connectFPMastersAndProducts(context, strSelectedPromotionRowId, emxFPRowID);
            
            HashMap hMap = (HashMap) Promotion.checkForArtworkMatrix(context, strSelectedPromotionRowId, emxFPRowID);
            if((Boolean) hMap.get("flag"))
            {       
                String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.AssignmentsSuccess");
            %>
	            <script language="Javascript">
	          //XSSOK strAlertMessage : Local variable coming from Res Bundle-I18N 
    		        alert("<%=strAlert%>");
            		getTopWindow().closeWindow();
            	</script>
            <%
            } 
            else
            {           
                //String sURL = AWLUtil.strcat("../components/emxCommonFS.jsp?functionality=ArtworkMatrixFSInstance&suiteKey=AWL&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl&mclArr=",mcl,"&artworkArr=",ae,"&promotions=",strSelectedPromotionRowId,"&FPRowId=",emxFPRowID,"&mode=assignPromotions");
                //String sURL = AWLUtil.strcat("../common/emxGridTable.jsp?table=AWLMCLPromotionArtworkElementsGridTable&rowJPO=AWLPromotionUI:getPromotionAssignmentMatrixElements&colJPO=AWLPromotionUI:getPromotionAssignmentMatrixMCLs&cellRangeJPO=AWLPromotionUI:getPromotionAssignmentMatrixRangeValues&cellUpdateJPO=AWLPromotionUI:updatePromotionAssignmentMatrixSelection&flatView=true&editLink=true&toolbar=null&mclArr=", mcl,"&artworkArr=",ae);

                gridBrosserArgs.add(new Pair(context, "mclArr", FrameworkUtil.join((StringList)hMap.get("mclList"),",")));
                gridBrosserArgs.add(new Pair(context, "artworkArr", FrameworkUtil.join((StringList)hMap.get("artworkList") ,",")));
                
                
                for(Pair<String, String> argument : gridBrosserArgs) {
                	gridBroserURL.append(argument.getFirst(context)).append('=').append(argument.getSecond(context)).append('&');
                }
                
                String sURL =  gridBroserURL.toString();
          %>
            	<script language="Javascript">            
            		showModalDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>",300,300,true,'',"Large");
            		getTopWindow().closeWindow();
            	</script>
            <%
            }        
	}else if("EditMCLPromotions".equalsIgnoreCase(strMode))
    {
    	Access.checkRequiredAccess(context,"PromotionArtworkEditMCL");
        String[] strProducts = (String[]) emxGetParameterValues(request,"emxTableRowId");
        strProducts = AWLUIUtil.getObjIdsFromRowIds(strProducts);
        
        StringList slProducts = BusinessUtil.toStringList(strProducts);
       
        boolean isKindOFProd[] = BusinessUtil.isKindOf(context, strProducts, AWLType.CPG_PRODUCT.get(context));
        for(boolean isProd : isKindOFProd) {
            if(!isProd) {
                String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NoCPGProducts");
                throw new FrameworkException(strAlert);
            }
        }
                                                        
        StringList slCurrentList = BusinessUtil.getInfo(context,slProducts,DomainConstants.SELECT_CURRENT);
        if(BusinessUtil.isNotNullOrEmpty(slCurrentList) && slCurrentList.contains(AWLConstants.STATE_OBSOLETE))
        {
        	String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.CPGProductsObsolete");
            throw new FrameworkException(strAlert);
        }
                                                        
        StringList slPromoArtwork = CPGProduct.getPromoArtworkAssociatedToProduct(context,slProducts);
                                                        
        if(BusinessUtil.isNullOrEmpty(slPromoArtwork)){
        	String strAlert =  AWLPropertyUtil.getI18NString(context,"emxAWL.Alert.NoPromotionalArtworkElementsAssociatedToProduct");
            throw new FrameworkException(strAlert);        	
        }else{
			StringList slPVList = new StringList();
            String mclSelectable = AWLUtil.strcat("from[", AWLRel.PRODUCT_COPY_LIST.get(context), "].to.id");
            MapList mlPVList = BusinessUtil.getInfoList(context,slProducts, mclSelectable);
            String mclPreliminary = AWLState.PRELIMINARY.get(context, AWLPolicy.MCL); 
            for(int i=0;i<mlPVList.size();i++)
            {
            	HashMap hm = (HashMap) mlPVList.get(i);
                StringList mclIdList = (StringList) hm.get(mclSelectable);
                if(BusinessUtil.isNullOrEmpty(mclIdList))
                	continue;
                                                	            
                StringList mclStateList = BusinessUtil.getInfo(context, mclIdList, DomainConstants.SELECT_CURRENT);
                for(int j = 0; j < mclStateList.size(); j++) {
                	if(mclPreliminary.equals(mclStateList.get(j)))
                    	slPVList.add(mclIdList.get(j));
                    }           
             }

                gridBrosserArgs.add(new Pair(context, "mclArr", FrameworkUtil.join(slPVList,",")));
                gridBrosserArgs.add(new Pair(context, "artworkArr", FrameworkUtil.join(slPromoArtwork,",")));
                
                for(Pair<String, String> argument : gridBrosserArgs) {
                	gridBroserURL.append(argument.getFirst(context)).append('=').append(argument.getSecond(context)).append('&');
                }
                
                String sURL =  gridBroserURL.toString();
                
            %>
	        	<script language="Javascript">        
	        		showNonModalDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>",300,300,true,'',"Large");
	        	</script>
	        <%
	   	}
    }
  } catch(Exception ex)
   {
        ex.printStackTrace();        
        if(session.getAttribute("error.message") == null)
        {
           session.setAttribute("error.message", ex.toString());
        }
    }
%> 
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>--%>
