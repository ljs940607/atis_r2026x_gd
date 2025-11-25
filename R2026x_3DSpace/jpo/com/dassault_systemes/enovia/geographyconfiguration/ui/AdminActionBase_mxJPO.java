package com.dassault_systemes.enovia.geographyconfiguration.ui;

import matrix.db.Context;
import matrix.db.JPO;
public class AdminActionBase_mxJPO {

	public AdminActionBase_mxJPO(Context context, String[] args) throws Exception {
		super();
	}

	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String addProducts(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "com.dassault_systemes.enovia.geographyconfiguration.ui.Document", null, "addProducts", args, String.class );
	}

	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String removeProducts(Context context, String args[]) throws Exception {
		return JPO.invoke( context, "com.dassault_systemes.enovia.geographyconfiguration.ui.Document", null, "removeProducts", args, String.class );
	}

	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String removeCountries(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "com.dassault_systemes.enovia.geographyconfiguration.ui.Document", null, "removeCountries", args, String.class );
	}

	@com.dassault_systemes.enovia.geographyconfiguration.ExecuteCallable
	public String addCountries(Context context, String[] args) throws Exception {
		return JPO.invoke( context, "com.dassault_systemes.enovia.geographyconfiguration.ui.Document", null, "addCountries", args, String.class );
	}
}
