/* 
 * This file contains references to jQuery usage which rely on the page(s) where 
 * this code is included to resolve the jQuery library version in use.
 *
 * For reference, the common version of jQuery to be used in all code is located here:
 *     webapps/VENCDjquery/latest/dist/jquery.min.js
 *
 * There is also an AMD loader available for this centralized jQuery version to use in 
 * dependency declarations:
 *     DS/ENOjquery/ENOjquery
 */

function toggleChart(idHeader, idChart, chart) {
	var visibleChart	= $(idChart).is(':visible');
	if(visibleChart) {
		$(idHeader).css('border-radius', '4px 4px 4px 4px');
		$(idChart).fadeOut(160);
	} else {
		$(idHeader).css('border-radius', '4px 4px 0px 0px');
		$(idChart).fadeIn(160);
		chart.setSize($(idChart).width() || 0, $(idChart).height() || 0, false);
	}
	jQuery(idHeader).toggleClass("header expanded").toggleClass("header");
}

function toggleChartFilter(idHeader, idChart, chart, idFilter) {
	var visibleChart	= $(idChart).is(':visible');
	var visibleFilter 	= $(idFilter).css('visibility');
	if(visibleChart) {
		if(visibleFilter == "visible") {
			$(idFilter).css('border-bottom', '1px solid #BABABA');
			$(idHeader).css('border-radius', '4px 4px 0px 0px');
		} else {
			$(idHeader).css('border-radius', '4px 4px 4px 4px');
		}
		$(idChart).fadeOut(160);
	} else {
		$(idHeader).css('border-radius', '4px 4px 0px 0px');
		$(idChart).fadeIn(160);
		$(idFilter).css('border-bottom', 'none');
		chart.setSize($(idChart).width() || 0, $(idChart).height() || 0, false);
	}
}

function toggleChartInfo(idHeader, idChart, chart, idInfo) {
	var visibleChart	= $(idChart).is(':visible');
	if(visibleChart) {
		$(idChart).fadeOut(160);
		$(idInfo).css('border-top', 'none');
	} else {
		$(idChart).fadeIn(160);
		if(null != chart) {
			chart.setSize($(idChart).width() || 0, $(idChart).height() || 0, false);
		}
		$(idInfo).css('border-top', '1px solid #bcbcbc');
	}
	jQuery(idHeader).toggleClass("header expanded").toggleClass("header");
}
