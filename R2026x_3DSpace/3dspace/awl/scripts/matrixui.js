$(document).ready(function() {
	
		       var values = [];
		       var table=$('#aemtable')[0];
	
	           $('.selected').each(function(){
		            var rowObj = $(this).parent()[0];
		            var col = $(this).parent().children().index(this);
		            
		            var mclID=$(rowObj.cells[0]).attr('mclid');	            
		            values.push(mclID);           
	            });
	            $('input[name$="preselectedMCLs"]').val(values);
	
                $(".selectable").click(function(){
                    var selrow = $(this).parent().parent().children().index(this.parentNode);
                    var rowObj=$(this).parent()[0];
                    var selcol = $(this).parent().children().index(this);
                    
                    if($('.selectedaehead').size()>0)
                    {
                        var table=$(this).parent().parent()[0];
                        var cell=table.rows[1].cells[$(this).parent().children().index(this)-1];
                        if(!$(cell).hasClass('selectedaehead'))
                        {
                            if($(this).hasClass('selected'))
                                $(this).removeClass('selected');
                            else
                                $(this).addClass('selected');
                            return;
                        }
                    }
                    else if($('.selectedmclhead').size()>0)
                    {
                        var table=$(this).parent().parent()[0];
                        var cell=table.
                            rows[$(this).parent().parent().children().index(this.parentNode)]
                            .cells[0];
                            
                        if(!$(cell).hasClass('selectedmclhead'))
                        {
                            if($(this).hasClass('selected'))
                                $(this).removeClass('selected');
                            else
                                $(this).addClass('selected');
                            return;
                        }
                    }
                    else
                    {
                        if($(this).hasClass('selected'))
                            $(this).removeClass('selected');
                        else
                            $(this).addClass('selected');
                        return;
                    }

                    if($(this).hasClass('selected'))
                    {
                        $('.selectedaehead').each(function() {
                            var column = $(this).parent().children().index(this);
                            var cell=rowObj.cells[column+1];
                            $(cell).removeClass('selected');
                        });

                        $('.selectedmclhead').each(function() {
                            var row = $(this).parent().parent().children().index(this.parentNode);
                            var cell=table.rows[row].cells[selcol];
                            $(cell).removeClass('selected');
                        });
                    }
                    else
                    {
                        $('.selectedaehead').each(function() {
                            var column = $(this).parent().children().index(this);
                            var cell=rowObj.cells[column+1];
                            $(cell).addClass('selected');
                        });

                        $('.selectedmclhead').each(function() {
                            var row = $(this).parent().parent().children().index(this.parentNode);
                            var cell=table.rows[row].cells[selcol];
                            $(cell).addClass('selected');
                        });
                    }
                });
                
                $(".aehead").click(function(){
                    $(".mclhead").removeClass('selectedmclhead');
                    
                    if($(this).hasClass('selectedaehead'))
                        $(this).removeClass('selectedaehead');
                    else
                        $(this).addClass('selectedaehead');
                });

                $(".mclhead").click(function(){
                    $(".aehead").removeClass('selectedaehead');
                    
                    if($(this).hasClass('selectedmclhead'))
                        $(this).removeClass('selectedmclhead');
                    else
                        $(this).addClass('selectedmclhead');
                });                
               
            }
	);
