/*
 ** ${CLASSNAME}
 **
 ** Copyright (c) 1993-2020 Dassault Systemes. All Rights Reserved.
 ** This program contains proprietary and trade secret information of
 ** Dassault Systemes.
 ** Copyright notice is precautionary only and does not evidence any actual
 ** or intended publication of such program
 */

import com.dassault_systemes.enovia.e6wv2.foundation.FoundationUserException;
import com.dassault_systemes.enovia.e6wv2.foundation.ServiceConstants;
import com.dassault_systemes.enovia.e6wv2.foundation.db.JPOUtil;
import com.dassault_systemes.enovia.e6wv2.foundation.jaxb.Datacollection;
import com.dassault_systemes.enovia.e6wv2.foundation.jaxb.Datacollections;
import com.dassault_systemes.enovia.e6wv2.foundation.jaxb.ServiceParameters;
import com.dassault_systemes.enovia.enterprisechangemgtuxservice.webservice.ChangeRequestService;
import com.dassault_systemes.enovia.enterprisechangemgtuxservice.webservice.InvestigationRequestService;

import matrix.db.Context;
/**
 * The <code>ChgUXServicesChangeOrderBase</code> class contains implementation code for change request web service.
 * @version Copyright (c) 1993-2020 Dassault Systemes. All Rights Reserved.
 */
public class ChgUXServicesInvestigationRequestBase_mxJPO extends emxDomainObject_mxJPO implements ServiceConstants
{
	
	/**
     * Constructor.
     * @param context the eMatrix <code>Context</code> object.
     * @param args holds no arguments.
     * @throws Exception if the operation fails.
     * @since ECM R423
     *
     */	 
    public ChgUXServicesInvestigationRequestBase_mxJPO (Context context, String[] args)
      throws Exception
    {
        super(context, args);
    }

    /**
     * This function supports the change request service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException
     */
    static public Datacollection getInvestigationRequests(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        Datacollection dcChangeRequest = parameters.getDatacollection();
	        //get specific change request info or user change requests
	        if (dcChangeRequest.getDataobjects().isEmpty()) {
	        	dcChangeRequest = InvestigationRequestService.getUserInvestigationRequests(context, parameters);
	        } else {
	        	dcChangeRequest = InvestigationRequestService.getInvestigationRequestInfo(context, parameters);
	        }
	        return dcChangeRequest;
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
       /**
     * This function supports the InvestigationRequest access service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException
     */
    static public Datacollections getInvestigationRequestAccessBits(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        final Datacollections dcChangeObjects = new Datacollections();
	        Datacollection dcChangeObject = InvestigationRequestService.getInvestigationRequestAccessBits(context, parameters);  
	        dcChangeObjects.getDatacollections().add(dcChangeObject);
	        return dcChangeObjects;
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}	        
    }
    /**
     * This function supports the Disposition access service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException
     */
    static public Datacollection getDispositionAccessBits(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.getDispositionAccessBits(context, parameters);
	        /*final Datacollections dcChangeObjects = new Datacollections();
	        Datacollection dcChangeObject = InvestigationRequestService.getDispositionAccessBits(context, parameters);  
	        dcChangeObjects.getDatacollections().add(dcChangeObject);
	        return dcChangeObjects;*/
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}	        
    }
    
    /**
     * This function supports get affected items service.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException
     */   
    static public Datacollections getAffectedItems(final Context context, final String[] args)throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	    	return InvestigationRequestService.getAffectedItems(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
	/**
	 * This function supports connect/disconnect affected items.
	 * @param context
	 * @param args
	 * @return 
	 * @throws FoundationUserException
	 */
	static public Datacollection updateAffectedItems(final Context context, final String[] args) throws FoundationUserException {
		try {
				final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
				return InvestigationRequestService.updateAffectedItems(context,serviceParameters);
			}catch(Exception ex) {
				ex.printStackTrace();
				throw new FoundationUserException(ex.getMessage());
			}
	}
	
     /**
     * This function supports get window of impact service.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException
     */   
    static public Datacollections getWindowOfImpact(final Context context, final String[] args)throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	    	return InvestigationRequestService.getWindowOfImpact(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
	 
	/**
	  * This function supports setting of fixed in and introduced in values
	  * @param context
	  * @param args
	  * @return 
	  * @throws FoundationUserException
	*/
	static public Datacollection updateWindowOfImpact(final Context context, final String[] args) throws FoundationUserException {
		try {
				final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
				return InvestigationRequestService.updateWindowOfImpact(context,serviceParameters);
			}catch(Exception ex) {
				ex.printStackTrace();
				throw new FoundationUserException(ex.getMessage());
			}
	}
 
    /**
     * This function supports the members service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException
     */
    static public Datacollections getMembersByRoles(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        final Datacollections dcChangeObjects = new Datacollections();
	        Datacollection dcChangeObject = new Datacollection();
	    	dcChangeObject = InvestigationRequestService.getMembersByRoles(context, parameters);  
	    	dcChangeObjects.getDatacollections().add(dcChangeObject);      
	        return dcChangeObjects;
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
	
	    /**
   * This function supports get investigation request issues service.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException
     */   
   static public Datacollections getIssues(final Context context, final String[] args)throws FoundationUserException {
	   try {
	       final ServiceParameters parameters = JPOUtil.unpackArgs(args);        
	       return InvestigationRequestService.getIssues(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
	
   
   /**
    * This function supports get investigation request issues service.
      * @param context
      * @param args
      * @return 
      * @throws FoundationUserException
      */   
    static public Datacollections getAffectedItemsOnExpand(final Context context, final String[] args)throws FoundationUserException {
 	   try {
 	       final ServiceParameters parameters = JPOUtil.unpackArgs(args);        
 	       return InvestigationRequestService.getAffectedItemsOnExpand(context, parameters);
 		}catch(Exception ex) {
 			ex.printStackTrace();
 			throw new FoundationUserException(ex.getMessage());
 		}
     }
 	
    
	    /**
     * This function supports the change hold/resume/cancel service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    /*static public Datacollection processInvestigationRequestAction(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.processInvestigationRequestAction(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }*/    
    
    /**
     * This function supports the change hold/resume/cancel service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection createDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.createDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }  
    
    /**
     * This function supports the change hold/resume/cancel service data/JPO handling.
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection createResolvedBy(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.createResolvedBy(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
        
    /**
     * This function changes the disposition type
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection changeDispositionType(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.changeDispositionType(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
	
	/**
     * This function mass updates approvers and disposition type
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    
    static public Datacollection massUpdateOnChangeImpacts(final Context context, final String[] args) throws FoundationUserException {
    	try {
        	final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
    		return InvestigationRequestService.massUpdateOnChangeImpacts(context,serviceParameters);
    	}catch(Exception ex) {
    		ex.printStackTrace();
    		throw new FoundationUserException(ex.getMessage());
    	}
    }
    
    
    /**
     * This function add Existing Disposition
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection addExistingDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.addExistingDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
    /**
     * This function removes the disposition
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection removeDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.removeDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
    /**
     * This function removes the resolved by
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection removeResolvedBy(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.removeResolvedBy(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
        
    /**
     * This function revise the disposition
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection reviseDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.reviseDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
        
    /**
     * This function replaces the disposition
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection replaceDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.replaceDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
    /**
     * This function get all the affected usages
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection getAllAffectedUsages(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.getAllAffectedUsages(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
    /**
     * This function creates the disposition through vertical assessment
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection createDispositionThroughVerticalAssessment(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.createDispositionThroughVerticalAssessment(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
    
    /**
     * This function supports add/remove members of investigation request.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException 
     */
    static public Datacollection updateMembers(final Context context, final String[] args) throws FoundationUserException {
    	try {
        	final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
    		return InvestigationRequestService.updateMembers(context,serviceParameters);
    	}catch(Exception ex) {
    		ex.printStackTrace();
    		throw new FoundationUserException(ex.getMessage());
    	}
    } 
    
    
    /**
     * This function supports add/remove approvers of disposition.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException 
     */
    static public Datacollection updateDispositionApprovers(final Context context, final String[] args) throws FoundationUserException {
    	try {
        	final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
    		return InvestigationRequestService.updateDispositionApprovers(context,serviceParameters);
    	}catch(Exception ex) {
    		ex.printStackTrace();
    		throw new FoundationUserException(ex.getMessage());
    	}
    } 
    
    
        /**
     * This function supports get dispositions service.
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException
     */   
    static public Datacollections getDispositions(final Context context, final String[] args)throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	    	return InvestigationRequestService.getDispositions(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }

      /**
     * This function promotes the business state for Investigation Request
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection changeBusinessState(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.changeBusinessState(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
 	

    /**
     * This function supports Change Impacts command in IR for Item View
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException 
     */
    static public Datacollection getImpactedIRs(final Context context, final String[] args) throws FoundationUserException {
    	try {
        	final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
    		return InvestigationRequestService.getImpactedIRs(context,serviceParameters);
    	}catch(Exception ex) {
    		ex.printStackTrace();
    		throw new FoundationUserException(ex.getMessage());
    	}
    }

    
    /**
     * This function update the disposition for various functionlities
     * @param context
     * @param args
     * @return
     * @throws FoundationUserException 
     */
    static public Datacollection updateDisposition(final Context context, final String[] args) throws FoundationUserException {
    	try {
	        final ServiceParameters parameters = JPOUtil.unpackArgs(args);
	        return InvestigationRequestService.updateDisposition(context, parameters);
		}catch(Exception ex) {
			ex.printStackTrace();
			throw new FoundationUserException(ex.getMessage());
		}
    }
	
	
	/**
	  * This function supports get disposition information service
	  * @param context
	  * @param args
	  * @return 
	  * @throws FoundationUserException
	*/
	static public Datacollection dispositionInfo(final Context context, final String[] args) throws FoundationUserException {
		try {
				final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
				return InvestigationRequestService.dispositionInfo(context,serviceParameters);
			}catch(Exception ex) {
				ex.printStackTrace();
				throw new FoundationUserException(ex.getMessage());
			}
	}

    /**
     * This function supports Change Impacts command in IR for Item View- Rolled Up
     * for retrieving impacted IRs connected to the structural child elements across various structures for given item
     * @param context
     * @param args
     * @return 
     * @throws FoundationUserException 
     */
    static public Datacollection getImpactedRolledUpIRs(final Context context, final String[] args) throws FoundationUserException {
    	try {
        	final ServiceParameters serviceParameters = (ServiceParameters)JPOUtil.unpackArgs(args);
    		return InvestigationRequestService.getImpactedRolledUpIRs(context,serviceParameters);
    	}catch(Exception ex) {
    		ex.printStackTrace();
    		throw new FoundationUserException(ex.getMessage());
    	}
    }
	
}






