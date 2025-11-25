/*
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
*/
import java.text.SimpleDateFormat;

import matrix.db.Context;

import com.matrixone.apps.awl.dao.ArtworkContent;
import com.matrixone.apps.awl.dao.ArtworkPackage;
import com.matrixone.apps.awl.dao.POA;
import com.matrixone.apps.awl.enumeration.AWLXMLPropertyKey;
import com.matrixone.apps.awl.util.BusinessUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.jdom.Document;
import com.matrixone.jdom.Element;

/**
 * 
 */

/**
 * @author RIS
 * 
 */
public abstract class AWLXMLCustomizationBaseAdapter_mxJPO  {

	protected POA currentPOA;
	protected ArtworkPackage artworkPackage;
	protected ArtworkContent currentArtworkElement;
	protected SimpleDateFormat sdf;
	protected String poaFolderPath;
	
	public void setPOA(Context context, POA currentPOA) throws FrameworkException {
		this.currentPOA = currentPOA;
	}
	
	public void setArtworkPackage(Context context, ArtworkPackage artworkPackage) throws FrameworkException {
		this.artworkPackage = artworkPackage;
	}
	
	public void setCurrentArtworkElement(Context context, ArtworkContent currentArtworkElement) throws FrameworkException {
		this.currentArtworkElement = currentArtworkElement;
	}
	
	public void setPOAFolderPath(Context context, String poaFolderPath) throws FrameworkException {
		this.poaFolderPath = poaFolderPath;
	}
	
    /**
     * This method used to get the class name.
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @return a String containing the class name
     * @throws Exception if the operation fails
     * @since AEF 10.0.1.0
     */

    public String getClassName(Context context,String[] args) throws FrameworkException
    {
        return getClass().getName();
    }
	/*
	 * (non-Javadoc)
	 * 
	 * @see ${CLASSNAME}#customizeRootElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizeRootElement(Context context, Element awlRootTag)throws FrameworkException;
	
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see ${CLASSNAME}#customizeDOCElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizeDOCElement(Context context, Element documentTag)throws FrameworkException;
	

	/*
	 * (non-Javadoc)
	 * 
	 * @see ${CLASSNAME}#customizeContentElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizeContentElement(Context context, Element contentTag)throws FrameworkException;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * ${CLASSNAME}#customizeLocaleElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizePOAElement(Context context, Element poaElem)throws FrameworkException;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * ${CLASSNAME}#customizeLocaleElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	@Deprecated
	public abstract void customizeLocaleElement(Context context, Element localeElem)throws FrameworkException;

	/*
	 * (non-Javadoc)
	 * 
	 * @see ${CLASSNAME}#customizeCopyElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizeCopyElement(Context context, Element copyElemTag)throws FrameworkException;
	
	/*
	 * To Customize Structure Element
	 */
	public abstract void customizeStructureElement(Context context, Element structureElement) throws FrameworkException;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * ${CLASSNAME}#customizeGraphicsElement(com.matrixone.jdom.Element,
	 * java.lang.Object)
	 */
	public abstract void customizeGraphicElement(Context context, Element graphicsElemTag) throws FrameworkException;
	
	public abstract Document getTransformDocument(Context context) throws FrameworkException;

	public SimpleDateFormat getDateTimeFormat(Context context, String dateFormat) throws FrameworkException {
		
		return BusinessUtil.isNullOrEmpty(dateFormat) ? new SimpleDateFormat(AWLXMLPropertyKey.DEFAULT_ENOVIA_DATE_FORMAT.getValue(context),context.getLocale()) :
														new SimpleDateFormat(dateFormat,context.getLocale());
	}

}
