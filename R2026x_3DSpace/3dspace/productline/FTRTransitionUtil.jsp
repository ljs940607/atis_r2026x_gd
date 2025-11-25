
<%@ page import="com.matrixone.servlet.*" %>
<%@page import="matrix.db.Context"%>
<%@page import="com.matrixone.apps.domain.util.MqlUtil"%>
<%@page import="com.matrixone.apps.domain.DomainConstants"%>
<%@page import="com.matrixone.apps.domain.DomainObject"%>
<%@page import="matrix.util.StringList"%>
<%@page import="java.util.Map"%>
<%@page import="jakarta.json.*" %>

<%! 
    public String getFTRModelDefinitionTransitionStatus(Context context)throws Exception {
		try {
			
			String strListMQL = "list expression $1";
			boolean status = true;
			String strExpr = MqlUtil.mqlCommand(context, strListMQL, "DisableVariantManagementTransition");
				if (strExpr != null && !"null".equalsIgnoreCase(strExpr) && !"".equalsIgnoreCase(strExpr)) {
					status = Boolean.parseBoolean(MqlUtil.mqlCommand(context, "list expression $1 select value dump","DisableVariantManagementTransition" ));
				}
				System.out.println("Feature Enabled: "+status);
				return status?"DISABLED":"ENABLED";
			} catch (Exception e) {
				throw e;
			}
    }
%>

<%!
  public String generateAdditionalData(Context context, String pageId, String objectId) throws Exception{
	String physicalId = "";
	String type ="";
	String additionalData = "";
	try{
		DomainObject domObject = new DomainObject(objectId);
		StringList selectList = new StringList();
		selectList.add(DomainConstants.SELECT_PHYSICAL_ID);
		selectList.add(DomainConstants.SELECT_TYPE);
		
		Map resultMap = domObject.getInfo(context, selectList);
		physicalId = (String)resultMap.get(DomainConstants.SELECT_PHYSICAL_ID);
		type = (String)resultMap.get(DomainConstants.SELECT_TYPE);
		
		JsonArrayBuilder itemsArrayBuilder = Json.createArrayBuilder();
		JsonObjectBuilder itemObjectBuilder = Json.createObjectBuilder();
		itemObjectBuilder.add("objectId", physicalId);
		itemObjectBuilder.add("objectType", type);
		itemObjectBuilder.add("objectTaxonomies", Json.createArrayBuilder().add(type));
		itemObjectBuilder.add("tab", pageId);
		itemsArrayBuilder.add(itemObjectBuilder.build());

		JsonObjectBuilder dataObjectBuilder = Json.createObjectBuilder();
		dataObjectBuilder.add("items", itemsArrayBuilder.build());

		JsonObject mainObject = dataObjectBuilder.build();

		additionalData = mainObject.toString();
		System.out.println("Additional Data : "+additionalData);
		
		
	}catch(Exception e){
	    throw new Exception("Exception while generating additional data for pageId: " + pageId + " and objectId: " + objectId + ". Error: " + e.getMessage());
	}
		return additionalData;
  }
%>



                 
