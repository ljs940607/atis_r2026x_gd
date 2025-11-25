(function($) {
    if(window.widget && window.widget.setIcon) {
        require({
            baseUrl: window.Configuration.webappsDir //set in ds_common.js
        },['DS/Controls/ProgressBar'], function (WUXProgressBar) {
            if(!window.widget.defaultIcon && window.widget.icon) {
                window.widget.defaultIcon = window.widget.icon;
            }
            var timeoutRemoveProgressBar = null;

            //Whenever an Ajax request is about to be sent, jQuery checks whether there are any other outstanding Ajax requests.
            //If none are in progress, jQuery triggers the ajaxStart event. Any and all handlers that have been registered with
            //the .ajaxStart() method are executed at this time.
            $( document ).ajaxStart(function() {
//                if(window.widget && window.widget.icon && window.widget.setIcon) {
//                    if(!window.widget.defaultIcon && window.widget.icon) {
//                        if (window.widget.metas && window.widget.metas.icon) {
//                            //use this
//                            window.widget.defaultIcon = window.widget.metas.icon;
//                        } else {
//                            window.widget.defaultIcon = window.widget.icon;
//                        }
//                    }
//                    window.widget.setIcon(window.Configuration.webappsDir+'/DELWebInfrastructure/DSCommon/graphics/ajx_isloading.gif');
//                } else {
//                    //no icon has been set for the widget.  There should always be one there, so find it in the DOM
//                    var $headerImg = $(".moduleUwa > .moduleHeader > span.icon > img"); //standalone widget
//                    if((!$headerImg || ($headerImg.length <= 0)) && window.parent && parent.document) {
//                        //get it from the dashboard widget
//                        $headerImg = $(".module.wi-"+widget.id+" .moduleHeader img.moduleHeader__icon",parent.document);
//                    }
//                    if(!$headerImg.attr('data-src')) {
//                        //save the old src image for later
//                        $headerImg.attr('data-src',$headerImg.attr('src'));
//                        if(window.widget && !window.widget.icon) {
//                            window.widget.icon = $headerImg.attr('src');
//                        }
//                    }
//                    $headerImg.attr('src',window.Configuration.webappsDir+'/DELWebInfrastructure/DSCommon/graphics/ajx_isloading.gif');
//                }

                if (timeoutRemoveProgressBar) {
                    clearTimeout(timeoutRemoveProgressBar);
                    timeoutRemoveProgressBar = null;
                }
                if ($(window.widget.body).children('.wux-controls-progressbar.ajax_indicator').length <= 0) {
                    //add the progressbar indicator to the DOM
                    var wuxProgressBar = new WUXProgressBar({ shape: 'linear', infiniteFlag: true, displayStyle: 'lite' }).inject(window.widget.body);
                    $(wuxProgressBar.elements.container).addClass('ajax_indicator');
                } else {
                    //it is already there.  Just show it.
                    $(window.widget.body).children('.wux-controls-progressbar.ajax_indicator').show();
                }
            });

            //Whenever an Ajax request completes, jQuery checks whether there are any other outstanding Ajax requests.
            //If none remain, jQuery triggers the ajaxStop event. Any and all handlers that have been registered with
            //the .ajaxStop() method are executed at this time. The ajaxStop event is also triggered if the last
            //outstanding Ajax request is cancelled by returning false within the beforeSend callback function.
            $( document ).ajaxStop(function() {
//                if(window.widget && window.widget.icon && window.widget.setIcon && window.widget.defaultIcon) {
//                    window.widget.setIcon(window.widget.defaultIcon);
//                } else {
//                    //no icon has been set for the widget.  There should always be one there, so find it in the DOM
//                    var $headerImg = $(".moduleUwa > .moduleHeader > span.icon > img"); //standalone widget
//                    if((!$headerImg || ($headerImg.length <= 0)) && window.parent && parent.document) {
//                        //get it from the dashboard widget
//                        $headerImg = $(".module.wi-"+widget.id+" .moduleHeader img.moduleHeader__icon",parent.document);
//                    }
//                    if($headerImg.attr('data-src')) {
//                        //save the old src image for later
//                        $headerImg.attr('src',$headerImg.attr('data-src'));
//                    }
//                }

                //initially, only hide the progressbar
                $(window.widget.body).children('.wux-controls-progressbar.ajax_indicator').hide();

                if (timeoutRemoveProgressBar) {
                    clearTimeout(timeoutRemoveProgressBar);
                }
                timeoutRemoveProgressBar = setTimeout(function() { //after a second on no activity, go ahead and remove it
                    $(window.widget.body).children('.wux-controls-progressbar.ajax_indicator').remove();
                    timeoutRemoveProgressBar = null;
                }, 1000);
            });
        });
    }
}(jQuery, document));
