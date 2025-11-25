/*!================================================================
  *  JavaScript Constants
  *  emxUIConstants.js
  *  Version 1.8
  *  UI Level 3
  *  Requires: (nothing)
  *  Last Updated: 11-Apr-03, Nicholas C. Zakas (NCZ)
  *
  *  This file contains the class definition of the actionbar.
  *
  *  Copyright (c) 1992-2020 Dassault Systemes. All Rights Reserved.
  *  This program contains proprietary and trade secret information
  *  of MatrixOne,Inc. Copyright notice is precautionary only
  *  and does not evidence any actual or intended publication of such program
  *
  *  static const char RCSID[] = $Id: emxUIConstants.js.rca 1.37.2.1 Tue Dec 16 04:55:36 2008 ds-smahapatra Experimental $
  *=================================================================
  */
var emxUIConstants={RTE_BOLD:"Bold",RTE_ITALIC:"Italic",RTE_UNDERLINE:"underline",RTE_STRIKETHROUGH:"strikethrough",RTE_SUPERSCRIPT:"superscript",RTE_SUBSCRIPT:"subscript",RTE_SPECIALCHARACTER:"specialcharacter",RTE_OK:"ok",RTE_CANCEL:"cancel"},Browser=function(){var e={IE:!1,FIREFOX:!1,CHROME:!1,MOZILLA_FAMILY:!1,SAFARI:!1,MOBILE:!1};return detectBrowser=function(r){var s=/(msie|trident)/i.test(r),n=/chrome|crios/i.test(r),t=/safari/i.test(r)&&!n,i=/firefox/i.test(r),o=/(Mobile)/i.test(r)||/(Touch|Tablet PC*)/.test(r);s?e.IE=!0:n?e.CHROME=!0:t?e.SAFARI=!0:i&&(e.FIREFOX=!0),o&&(e.MOBILE=!0),(n||t||i)&&(e.MOZILLA_FAMILY=!0)},detectBrowser(navigator.userAgent),e}(),DIR_IMAGES="../common/images/",DIR_STYLES="../common/styles/",DIR_APPLEVEL_STYLES="../common/styles/",DIR_APPLEVEL_IMAGES="../common/images/",DIR_TREE=DIR_IMAGES,DIR_NAVBAR=DIR_IMAGES,DIR_SEARCHPANE=DIR_IMAGES,DIR_BUTTONS=DIR_APPLEVEL_IMAGES+"",DIR_SMALL_ICONS=DIR_IMAGES+"",DIR_BIG_ICONS=DIR_IMAGES+"",DIR_UTIL=DIR_APPLEVEL_IMAGES,IMG_BULLET=DIR_IMAGES+"yellowbullet.gif",IMG_SPACER=DIR_IMAGES+"utilSpacer.gif",IMG_LOADING=DIR_IMAGES+"iconStatusLoading.gif",URL_MAIN="../common/emxMainFrame.asp",URL_SHRUNK="../common/emxShrunkFrame.asp",UI_LEVEL=3,CALENDAR_START_DOW=0,HIDDEN_FRAME_LIST=["listHidden","postHidden","formViewHidden","formEditHidden","formCreateHidden","hiddenFrame","pagehidden","imageHidden","searchHidden"],strUserAgent=navigator.userAgent.toLowerCase(),isKHTML=Browser.SAFARI||Browser.CHROME,isIE=Browser.IE,isMoz=Browser.FIREFOX,isChrome=Browser.CHROME,isMac=navigator.platform.indexOf("Mac")>-1,isUnix=strUserAgent.indexOf("x11")>-1,isHPUX=strUserAgent.indexOf("hp-ux")>-1,isSunOS=strUserAgent.indexOf("sunos")>-1;
//! Public Method Array.remove()
//!     This methods finds the given item and removes it from the array.
//!     It does nothing if the item is not found.
//! Public Method String.htmlEncode()
//!     This method converts a string into an HTML string by replacing
//!     all illegal characters with appropriate entities.
//! Public Function findFrame()
//!     This function finds a frame with a given name.
function findFrame(e,r){if("_top"==r)return getTopWindow();if("_self"==r)return self;if("_parent"==r)return parent;var s=null;try{if(e&&e.frames)for(var n=0;n<e.frames.length&&!s;n++)try{e.frames[n]&&e.frames[n].name&&e.frames[n].name==r&&(s=e.frames[n])}catch(e){}}catch(e){e.description&&-1==e.description.search(/Denied/i)&&-2146828218!=e.number&&-2147418094!=e.number&&(""==e.description?alert(emxUIConstants.STR_JS_AnExceptionOccurred+" "+emxUIConstants.STR_JS_ErrorName+" "+e.name+emxUIConstants.STR_JS_ErrorDescription+" "+e.description+emxUIConstants.STR_JS_ErrorNumber+" "+e.number+emxUIConstants.STR_JS_ErrorMessage+" "+e.message):-2147024891!=e.number&&alert(e.description))}if(!s)try{if(e&&e.frames)for(n=0;n<e.frames.length&&!s;n++)s=findFrame(e.frames[n],r)}catch(e){e.description&&-1==e.description.search(/Denied/i)&&-2146828218!=e.number&&-2147418094!=e.number&&(""==e.description?alert(emxUIConstants.STR_JS_AnExceptionOccurred+" "+emxUIConstants.STR_JS_ErrorName+" "+e.name+emxUIConstants.STR_JS_ErrorDescription+" "+e.description+emxUIConstants.STR_JS_ErrorNumber+" "+e.number+emxUIConstants.STR_JS_ErrorMessage+" "+e.message):-2147024891!=e.number&&alert(e.description))}return s}
//! Public Function openerFindFrame()
//!     This function finds a frame from current window or its
//!     getWindowOpener() with a given name.
//! Public Function addURLParam()
//!     This function adds a parameter to a URL.
//! Public Function addUniqueURLParam()
//!     This function adds a parameter to a URL if not existing.
//! Public Function showError()
//!     This function displays an alert with error text.
//! Public Function showConfirmation()
//!     This function displays a confirmation box with confirmation text.
//! Public Function doNothing()
//!     This function is assigned to an event in order to block its occurance.
//! Private Function getStyleSheet()
//!     This function creates the style sheet string for a given style sheet prefix.
//! Public Function addStyleSheet()
//!     This function adds a style sheet to the given document.
//! we have to refactor this method as not to take cssPath once we move all the CSS from main folder into common/styles folder
//! Public Function appendStyleSheet()
//!     This function appends a style sheet to the given document.
//! we have to refactor this method as not to take cssPath once we move all the CSS from main folder into common/styles folder
//! Public Function turnOffProgress()
//!     This function changes the progress clock so that it disappears.
//! Public Function turnOnProgress()
//!     This function changes the progress clock so that it reappears.