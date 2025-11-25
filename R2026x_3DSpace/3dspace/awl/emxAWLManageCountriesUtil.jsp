
<%-- Common Includes --%>

<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonAppInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../emxTagLibInclude.inc"%>

<%@page import = "com.matrixone.apps.productline.*"%>

<%@page import = "com.matrixone.apps.domain.DomainObject"%>
<%@page import = "com.matrixone.apps.domain.util.mxType"%>

<%@page import = "com.matrixone.apps.domain.*"%>
<%@page import = "com.matrixone.apps.domain.util.FrameworkProperties"%>
<%@page import = "com.matrixone.apps.domain.util.FrameworkUtil"%>
<%@page import = "com.matrixone.apps.domain.util.MapList"%>
<%@page import = "com.matrixone.apps.domain.Job"%>

<%@page import = "com.matrixone.apps.cpd.dao.Country"%>
<%@page import = "com.matrixone.apps.cpd.dao.CPDCache"%>
<%@page import = "com.matrixone.apps.awl.dao.ArtworkTemplate"%>
<%@page import = "com.matrixone.apps.awl.dao.ArtworkMaster"%>
<%@page import = "com.matrixone.apps.awl.dao.AWLObject"%>

<%@page import = "com.matrixone.apps.awl.util.BusinessUtil"%>
<%@page import = "com.matrixone.apps.awl.enumeration.AWLType"%>
<%@page import = "com.matrixone.apps.awl.enumeration.*"%>

<%@page import = "com.matrixone.apps.awl.util.ArtworkElementUtil"%>
<%@page import = "com.matrixone.apps.awl.util.ArtworkUtil"%>
<%@page import = "com.matrixone.apps.awl.util.AWLConstants"%>
<%@page import = "com.matrixone.apps.awl.util.Access"%>
<%@page import = "com.matrixone.apps.awl.util.AWLUtil"%>
<%@page import = "com.matrixone.apps.awl.util.AWLPropertyUtil"%>

<%@page import = "com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@page import = "com.matrixone.apps.common.util.ComponentsUIUtil"%>

<%@page import = "matrix.util.MatrixException"%>
<%@page import = "matrix.util.StringList"%>
<%@page import = "matrix.db.Context"%>
<%@page import = "matrix.db.MQLCommand"%>

<%@page import = "java.util.ArrayList"%>
<%@page import = "java.util.List"%>
<%@page import = "java.util.HashMap"%>
<%@page import = "java.util.StringTokenizer"%>

<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIConstants.js"></script>
<script language="Javascript" src="../common/scripts/emxUIUtility.js"></script>
<script language="Javascript" src="../common/scripts/emxUITableUtil.js"></script>
<script language="Javascript" src="../common/scripts/emxUIFreezePane.js"></script>
<script language="Javascript" src="../common/scripts/emxUICore.js"></script>
<script language="javascript" src="../awl/scripts/emxAWLUtil.js"></script>

<%
   String strMode = emxGetParameter(request,"mode");
   String strTargetLocation = emxGetParameter(request,"targetLocation");
   String languageStr      = request.getHeader("Accept-Language");
   
   boolean  artworkTemplateManageCountries = "ArtworkTemplateManageCountries".equalsIgnoreCase(strMode);
   
   //This is used from Artwork Element Summary page
   boolean  viewCountriesAssociated = "viewCountriesAssociated".equalsIgnoreCase(strMode);
   //This is used from Artwork Element Properties page
   boolean  viewCountriesAssociatedToFeature = "viewCountriesAssociatedToFeature".equalsIgnoreCase(strMode);
   

	if(viewCountriesAssociated || viewCountriesAssociatedToFeature || artworkTemplateManageCountries)
	{
       try
       {
			%> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
           boolean flag = true; 
           String errMessage = "";
           String actionPage = "";
           String manageCountriesFor = "";
           boolean isPM = Access.isProductManager(context);
	       boolean isAuthor = Access.isMasterCopyAuthor(context);
	       boolean isPMorAuthor = (isPM || isAuthor);
           
           List<String> strSelectedFPIds =  (List<String>) BusinessUtil.toStringList(ComponentsUIUtil.getSplitTableRowIds(request.getParameterValues("emxTableRowId")));
           List<String> selectedIDs = strSelectedFPIds == null || strSelectedFPIds.isEmpty() ? AWLUtil.toList(emxGetParameter(request,"objectId")) :
                       	  							 (List<String>) BusinessUtil.toStringList(strSelectedFPIds);
           //Manage Countires for Artwork Elements
           if(viewCountriesAssociated || viewCountriesAssociatedToFeature) {
           
                boolean[] isArtworkElements = 
                    BusinessUtil.isKindOf(context,BusinessUtil.toStringArray(selectedIDs),AWLType.MASTER_ARTWORK_ELEMENT.get(context));
                for(boolean b : isArtworkElements)  
                {
                    if(!b)
                    {
                        flag = false;
                        errMessage = "emxAWL.ManageCountries.Alert";
                    }   
                }
                if(flag)
                {
                    manageCountriesFor = "ArtworkElement";
                    if(!isPMorAuthor && selectedIDs.size()>1)
                    {
                        flag = false;
                        errMessage = "emxAWL.RowSelect.Single";
                    } 
                    else if(selectedIDs.size()>1) 
                    {
                        StringList selects = new StringList(DomainObject.SELECT_CURRENT);
                        selects.add("latest");
                        selects.add(DomainObject.SELECT_POLICY);
                        MapList aeDetails = BusinessUtil.getInfo(context, BusinessUtil.toStringList(selectedIDs), selects);
                        for(int i=0; i<aeDetails.size(); i++)   
                        {
                            HashMap aeMap = (HashMap)aeDetails.get(i);
                            String isLatest = BusinessUtil.getString(aeMap, "latest");
                            String current = BusinessUtil.getString(aeMap, DomainObject.SELECT_CURRENT);
                            String policy = BusinessUtil.getString(aeMap, DomainObject.SELECT_POLICY);
                            if("FALSE".equalsIgnoreCase(isLatest))
                            {
                                flag = false;
                                errMessage = "emxAWL.LatestElements.Alert";
                                break;
                            } 
                            if(AWLState.OBSOLETE.get(context, policy).equalsIgnoreCase(current))
                            {
                               flag = false;
                               errMessage = "emxAWL.Alert.isChildArtworkAssemblyObsolete";
                               break;
                    		}
                        }
                        actionPage = "ManageCountryAssignmentsFSInstance";
                    }
                    else if (selectedIDs.size() == 1 && BusinessUtil.isNotNullOrEmpty(selectedIDs.get(0))) 
                    {
                        String masterCopyId = ArtworkElementUtil.getMasterCopyByCopyElement(context, selectedIDs.get(0));
                        DomainObject masterObj = new DomainObject(masterCopyId);
                        boolean isLatestRev = masterObj.isLastRevision(context);
                        String masterState = masterObj.getInfo(context, DomainObject.SELECT_CURRENT);
                        if(!isPMorAuthor || !isLatestRev || AWLState.OBSOLETE.get(context, AWLPolicy.ARTWORK_ELEMENT).equalsIgnoreCase(masterState)) {
                            actionPage = "ViewCountriesAssociated";
                        } else {
                            actionPage = "ManageCountryAssignmentsFSInstance";
                        }
                    } 
            }
         } else if(artworkTemplateManageCountries) {
              manageCountriesFor = "ArtworkTemplate";
              //Consider we are handling only single selection
              String artworktEmplateId = selectedIDs.get(0);
              boolean isArtworkTemplate = 
                    BusinessUtil.isKindOf(context,artworktEmplateId,AWLType.ARTWORK_TEMPLATE.get(context));
              boolean isPreliminary = 
                    AWLState.PRELIMINARY.get(context,AWLPolicy.ARTWORK_TEMPLATE.get(context)).equals(
                    BusinessUtil.getInfo(context, artworktEmplateId, DomainConstants.SELECT_CURRENT));
                    
              if(!isArtworkTemplate)
              {
                  flag = false;
                  errMessage = "emxAWL.ArtworkTemplate.ManageCountries.Err.SelectArtworkTemplte";
              } else if(!isPreliminary || !isPM) {
                  actionPage = "ViewCountriesAssociated";
              } else {
                 actionPage = "ManageCountryAssignmentsFSInstanceAT";
              }
         }  
         if(flag)
         {
                String objectIds = FrameworkUtil.join(BusinessUtil.toStringList(selectedIDs), ",");
                String sURL = AWLUtil.strcat("../awl/emxAWLCommonFS.jsp?functionality=",actionPage,"&suiteKey=AWL&HelpMarker=emxhelpartworktemplateproperties&StringResourceFileId=emxAWLStringResource&emxSuiteDirectory=awl&submitAction=refreshCaller&objectId=",objectIds);
                if("ViewCountriesAssociated".equals(actionPage))
                {
	                %>
	                <script language="javascript" type="text/javaScript">
	                showAssociatedObjects("<%=XSSUtil.encodeForJavaScript(context,objectIds)%>", "relationship_CountriesAssociated", "type_Country",  false, true, "emxAWL.Heading.ViewCountriesAssociated");
	                </script>
	             	<%
                }
                else if("ManageCountryAssignmentsFSInstance".equals(actionPage) || "ManageCountryAssignmentsFSInstanceAT".equals(actionPage))
                {
                   sURL = AWLUtil.strcat(sURL, "&heading=emxAWL.ArtworkTemplate.ManageCountryAssignments");
                %>
                    <script language="javascript" type="text/javaScript">
                        getTopWindow().showSlideInDialog("<%=XSSUtil.encodeURLForServer(context, sURL)%>", true);
                    </script>
                 <%
                }
         } 
         else {
            errMessage = AWLPropertyUtil.getI18NString(context, errMessage);
 				 %>
               		<script language="javascript" type="text/javaScript">
               		    //XSSOK errMessage : Local variable coming from Res Bundle-I18N
               			alert("<%=errMessage%>");
                		</script>
                 <%
         }
   	}
    catch(Exception mxEx)
    {           
    	%>
        	<script language="javascript" type="text/javaScript">
                      alert("<%=XSSUtil.encodeForJavaScript(context, mxEx.getMessage())%>");
            </script>
         <%           
         mxEx.printStackTrace();
     }
   }   
   else if("AssignCountries".equalsIgnoreCase(strMode))
   {
       try
       {  
    	   %> <%@include file = "../common/enoviaCSRFTokenValidation.inc"%> <%
            String selCountryIDs = request.getParameter("selCountryIds");
            String partSelCountryIDs = request.getParameter("partSelCountryIds");
            String objectIds = emxGetParameter(request,"ProductIds");
            StringList countriesList =  new StringList();
       
            String []selCountryIDArr = BusinessUtil.isNullOrEmpty(selCountryIDs) ?  new String[]{} : selCountryIDs.split("\\|");
            String []partSelcountryIDArr = BusinessUtil.isNullOrEmpty(partSelCountryIDs) ?  new String[]{} : partSelCountryIDs.split("\\|");
       
            List<Country> selCountriesList=new ArrayList<Country>();
            List<Country> partSelCountriesList=new ArrayList<Country>();
            
            for(String countryID: selCountryIDArr)
                selCountriesList.add(CPDCache.getCountry(countryID));
            
            for(String countryID: partSelcountryIDArr)
                partSelCountriesList.add(CPDCache.getCountry(countryID));
       
            String[] objectIdsArr = objectIds.split(",");
            for(String id : objectIdsArr) 
            {
 	    		//AWLObject awlObject =  (AWLObject)DomainObject.newInstance(context, id, "AWL");
 	    		AWLObject awlObject   = BusinessUtil.isKindOf(context, id, AWLType.MASTER_ARTWORK_ELEMENT.get(context)) ? new ArtworkMaster(id) : new ArtworkTemplate(id);
 	    	    awlObject.manageCountriesFromSelection(context, selCountriesList, partSelCountriesList, AWLRel.COUNTRIES_ASSOCIATED);
 	       }
 %>	
	       <script language="javascript" type="text/javaScript">
		       getTopWindow().closeSlideInDialog();
		       if(findFrame(getTopWindow(),"AWLProductLineArtworkElements")!=null)
		           findFrame(getTopWindow(),"AWLProductLineArtworkElements").location.reload();
		       else if(findFrame(getTopWindow(),"AWLMasterLabelElements")!=null)
		           findFrame(getTopWindow(),"AWLMasterLabelElements").location.reload();
		       else if(findFrame(getTopWindow(),'AWLMasterLabelElementProperties')!=null)
		           findFrame(getTopWindow(),'AWLMasterLabelElementProperties').location.reload();
		       else if(findFrame(getTopWindow(),'detailsDisplay')!=null)
		           findFrame(getTopWindow(),'detailsDisplay').location.reload();
		       
		       if(findFrame(getTopWindow(),'AWLArtworkTemplateSummaryCommand')!=null)
	          	findFrame(getTopWindow(),'AWLArtworkTemplateSummaryCommand').location.reload();
	       </script>
	       <%
       }
       catch(Exception mxEx)
       {           
           %>
                   <script language="javascript" type="text/javaScript">
                         
                      alert("<%=XSSUtil.encodeForJavaScript(context, mxEx.getMessage())%>");
                      getTopWindow().closeSlideInDialog();                      
                   </script>
           <%           
           mxEx.printStackTrace();
       }      
   }
%>
<%@ include file = "../common/emxNavigatorBottomErrorInclude.inc" %>  
