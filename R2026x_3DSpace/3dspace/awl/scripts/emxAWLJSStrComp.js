var styleRemove;
var styleAdded;


function showCopyTextDiff(evnt, elem, FirstCopyText, SecondCopyText,
		firstHeader, secondHeader) {
	var objEvent = evnt;
	if (!evnt) {
		objEvent = emxUICore.getEvent();
	}
	objEvent = {
		clientX : objEvent.clientX,
		clientY : objEvent.clientY
	};
	mouseOverId = "Diff";
	
	
	var result = compareChar(FirstCopyText,SecondCopyText , " ", true);
	
	
	var message = "<strong>" + firstHeader + "</strong><br/>" + result[0]
			+ "<br/><br/><strong>" + secondHeader + "</strong><br/>"
			+ result[1];
	emxUITooltips.SHOW_DELAY = 0;// 500;
	emxUITooltips.PADDING = "4px";
	emxUITooltips.BGCOLOR = "#D8E2F3";
	emxUITooltips.MOVEWITHMOUSE = true;
	if (tooltip == null)
		tooltip = new emxUITooltipManager();

	tooltip.hideTooltip(evnt, true);
	tooltip.cleanUpTooltip();
	tooltip.tips = [];
	// if(mouseOverId != "")
	tooltip.addTooltipFor(elem, message, true, evnt);

}

function compareChar(Str1, Str2, str3, bool1) {
	styleRemove = "#F5A9A9";
	styleAdded = "#A9F5A9";

	var Results = "";
	if (bool1) {
		Results = new Array(2);
		Results[0] = "";
		Results[1] = "";
	}
	Style1 = styleAdded;
	Style2 = styleRemove;
	var ary = new Array(2);
	ary[0] = new Array(5);
	ary[0][0] = Str1.split(str3);
	
	
	ary[0][1] = new Array(ary[0][0].length);
	ary[0][2] = new Array(ary[0][0].length);
	ary[1] = new Array(5);
	ary[1][0] = Str2.split(str3);
	
	
	ary[1][1] = new Array(ary[1][0].length);
	ary[1][2] = new Array(ary[1][0].length);
	var a1 = 0;
	var a2 = 1;
	// Compare both directions.

	for ( var k = 0; k < 2; k++)
	{
		var l = 0;
		if (k == 1) 
		{
			
			a1 = 1;
			a2 = 0;
		}
		var m = ary[a1][0].length;
		
		var n = ary[a2][0].length;
		
		var j = l;
		var o = 1;
		var revComp = false;
		for ( var i = 0; ((revComp == false && i < m) || (revComp == true && i > -1));) 
		{
			var valueNotFound = true;
			for (j = l; ((revComp == false && j < n) || (revComp == true && j > -1));) 
			{
				if (ary[a1][0][i] == ary[a2][0][j])
				{
					ary[a1][o][i] = j;
					if (revComp == false) 
					{
						l = j + 1;
					} else
					{
						l = j - 1;
					}
					valueNotFound = false;
					break;
				}
				if (revComp == false)
				{
					j++;
				} else 
				{
					j--;
				}
			}
			if (valueNotFound)
			{
				ary[a1][o][i] = -1;
			}
			if (revComp == false)
			{
				i++;
			} else 
			{
				i--;
			}
			if (i == m)
			{
				i--;
				l = n - 1;
				j--;
				revComp = true;
				o++;
			}
		} //end i loop
		ary[a1][3] = 0;
		ary[a1][4] = 0;
		for ( var i = 0; i < ary[a1][0].length; i++) 
		{
			if (ary[a1][1][i] != (-1)) 
			{
				ary[a1][3] = ary[a1][3] + 1;
			}
			if (ary[a1][2][i] != (-1))
			{
				ary[a1][4] = ary[a1][4] + 1;
			}
		}
	}
	o = 1;
	var maxi = 0;
	var maxj = 0;
	var highest = 0;
	for ( var i = 0; i < 2; i++)
	{
		for ( var j = 0; j < 2; j++)
		{
			if (ary[i][j + 3] > highest) 
			{
				maxi = i;
				maxj = j;
				highest = ary[i][j + 3];
			}
		}
	}
	var increment = 1;
	var initialVal = 0;
	var str2StartIndex = -1;
	var str2EndIndex = -1;
	a1 = 0;
	a2 = 1;
	if (maxi == 1)
	{
		a1 = 1;
		a2 = 0;
		Style1 = styleRemove;
		Style2 = styleAdded;
	}
	if (maxj == 1) 
	{
		increment = -1;
		initialVal = ary[a1][0].length - 1;
		str2StartIndex = ary[a2][0].length;
	}
	for ( var i = initialVal; i > -1 && i < ary[a1][0].length; i = i
			+ increment) 
	{
		var string1 = "";
		var string2 = "";
		if ((ary[a1][maxj + 1][i] > -1)) 
		{
			str2EndIndex = ary[a1][maxj + 1][i];
			if ((i != initialVal && (ary[a1][maxj + 1][i - increment] == -1 || ary[a1][maxj + 1][i] != ary[a1][maxj + 1][i
					- increment]
					+ increment)))
			{
				var dummyi = i - increment;
				for (; (dummyi >= 0 && dummyi < ary[a1][0].length && ary[a1][maxj + 1][dummyi] == -1); dummyi = dummyi
						- increment)
				{
					if (string1 == "")
					{
						string1 = ary[a1][0][dummyi];
					} else 
					{
						if (maxj == 0) 
						{
							string1 = ary[a1][0][dummyi] + str3 + string1;
						} else
						{
							string1 = string1 + str3 + ary[a1][0][dummyi];
						}
					}
				}
			}
			str2StartIndex = str2StartIndex + increment;
			for (; ((increment == 1 && str2StartIndex <= str2EndIndex
					- increment) || (increment == -1 && str2StartIndex >= str2EndIndex
					- increment)); str2StartIndex = str2StartIndex + increment)
			{
				if (string2 == "") 
				{
					string2 = ary[a2][0][str2StartIndex];
				} else
				{
					if (maxj == 0) 
					{
						string2 = string2 + str3 + ary[a2][0][str2StartIndex];
					} else 
					{
						string2 = ary[a2][0][str2StartIndex] + str3 + string2;
					}
				}
			}
			if (str3 == "" || string1 == "" || string2 == "")
			{
				Results = getFormattedStrings(Results, str3, string1, string2,
						increment, Style1, Style2, bool1);
			} else
			{       
							
				var tempResult;
				if (maxi == 0)
				{
					tempResult = compareChar(string1, string2, "", bool1);
				} else
				{
					tempResult = compareChar(string2, string1, "", bool1);
				}
				if (bool1) 
				{
					if (maxj == 0) 
					{
						Results[0] = Results[0] + str3 + tempResult[0];
						Results[1] = Results[1] + str3 + tempResult[1];
					} else 
					{
						Results[0] = tempResult[0] + str3 + Results[0];
						Results[1] = tempResult[1] + str3 + Results[1];
					}
				} else 
				{
					if (maxj == 0)
					{
						Results = Results + str3 + tempResult;
					} else 
					{
						Results = tempResult + str3 + Results;
					}
				}
			}
			Results = getFormattedString(Results, str3, ary[a1][0][i],
					increment, null, bool1);
		}

		if ((increment == 1 && i == ary[a1][0].length - 1)
				|| (i == 0 && increment == -1))
		{
			var dummyi = i;
			string1 = "";
			string2 = "";
			for (; (dummyi >= 0 && dummyi < ary[a1][0].length && ary[a1][maxj + 1][dummyi] == -1); dummyi = dummyi
					- increment) 
			{
				if (maxj == 0) 
				{
					string1 = ary[a1][0][dummyi] + str3 + string1;
				} else 
				{
					string1 = string1 + str3 + ary[a1][0][dummyi];
				}
			}
			str2StartIndex = str2EndIndex;
			str2StartIndex = str2StartIndex + increment;
			for (; (str2StartIndex > -1 && str2StartIndex < ary[a2][0].length); str2StartIndex = str2StartIndex
					+ increment) 
			{
				if (maxj == 0)
				{
					string2 = string2 + str3 + ary[a2][0][str2StartIndex];
				} else
				{
					string2 = ary[a2][0][str2StartIndex] + str3 + string2;
				}
			}
			if (str3 == "" || string1 == "" || string2 == "")
			{
				Results = getFormattedStrings(Results, str3, string1, string2,
						increment, Style1, Style2, bool1);
			} else 
			{
				
				
				var tempResult;
				if (maxi == 0) 
				{
					
					tempResult = compareChar(string1, string2, "", bool1);
				} else
				{
					
					tempResult = compareChar(string2, string1, "", bool1);
				}
				if (bool1)
				{
					if (maxj == 0) 
					{
						Results[0] = Results[0] + str3 + tempResult[0];
						Results[1] = Results[1] + str3 + tempResult[1];
					} else
					{
						Results[0] = tempResult[0] + str3 + Results[0];
						Results[1] = tempResult[1] + str3 + Results[1];
					}
				} else {
					if (maxj == 0)
					{
						Results = Results + str3 + tempResult;
					} else 
					{
						Results = tempResult + str3 + Results;
					}
				}
			}
		}
	}
	return Results;
}

function getFormattedStrings(Results, str3, value1, value2, increment, style1,
		style2, bool1) {
	if (value1 != null && value1 != "") {
		Results = getFormattedString(Results, str3, value1, increment, style1,
				bool1);
	}
	if (value2 != null && value2 != "") {
		Results = getFormattedString(Results, str3, value2, increment, style2,
				bool1);
	}
	return Results;
}

function getFormattedString(Results, str3, value, increment, style, bool1) {
	
	if (style != null && style != "") {
		value = "<font style=\"background-color: " + style + "\">" + value
				+ "</font>";
		// value = "<font style=\"color: " + style + "\">" + value + "</font>";
		// if (style == styleRemove) {
		// value = "<s><del>" + value + "</del></s>";
		// } else {
		// value = "<i>" + value + "</i>";
		// }
	}
	if (bool1) {
		var indxResult = 0;
		if (style == styleRemove) {
			indxResult = 1;
		}
		if (increment == 1) {
			Results[indxResult] = Results[indxResult] + str3 + value;
		} else {
			Results[indxResult] = value + str3 + Results[indxResult];
		}
		if (style == null || style == "") {
			if (indxResult == 0) {
				indxResult = 1;
			} else {
				indxResult = 0;
			}
			if (increment == 1) {
				Results[indxResult] = Results[indxResult] + str3 + value;
			} else {
				Results[indxResult] = value + str3 + Results[indxResult];
			}
		}
	} else {
		if (increment == 1) {
			Results = Results + str3 + value;
		} else {
			Results = value + str3 + Results;
		}
	}
	return Results;
}
function appendResult(Results, str3, value, increment) {
	if (increment == 1) {
		Results = Results + str3 + value;
	} else {
		Results = value + str3 + Results;
	}
	return Results;
}







