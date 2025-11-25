define('DS/StuMiscContent/StuHighlightBe', ['DS/StuCore/StuContext', 'DS/StuModel/StuBehavior', 'DS/EPTaskPlayer/EPTask'], function (STU, Behavior, Task) {
	'use strict';

	//Highlight Behavior
	var Highlight = function () {

		Behavior.call(this);

		this.componentInterface = this.protoId;
		this.highlightOnMouseover = true;


		this.name = "Highlight";
		this.mainViewer;
	};

	Highlight.prototype = new Behavior();
	Highlight.prototype.constructor = Highlight;

	Highlight.prototype.onActivate = function (oExceptions) {
		Behavior.prototype.onActivate.call(this, oExceptions);
		this.main3DViewer = new StuViewer();
		if (this.highlightOnMouseover) {
			this.getActor().addObjectListener(STU.ClickableMoveEvent, this, 'onEnterMouseOver');
			this.getActor().addObjectListener(STU.ClickableExitEvent, this, 'onExitMouseOver');
		}

	};

	Highlight.prototype.onDeactivate = function () {

		Behavior.prototype.onDeactivate.call(this);
		this.getActor().removeObjectListener(STU.ClickableMoveEvent, this, 'onEnterMouseOver');
		this.getActor().removeObjectListener(STU.ClickableExitEvent, this, 'onExitMouseOver');

	};

	Highlight.prototype.onEnterMouseOver = function () {
		var currentActor = this.getActor();
		var renderManager = STU.RenderManager.getInstance();
		renderManager.highlight(currentActor);
	};

	Highlight.prototype.onExitMouseOver = function () {
		var currentActor = this.getActor();
		var renderManager = STU.RenderManager.getInstance();
		renderManager.dehighlight(currentActor);

	};

	Highlight.prototype.highlight = function () {
		var currentActor = this.getActor();
		var renderManager = STU.RenderManager.getInstance();
		renderManager.highlight(currentActor);
	};

	Highlight.prototype.deHighlight = function () {
		var currentActor = this.getActor();
		var renderManager = STU.RenderManager.getInstance();
		renderManager.dehighlight(currentActor);
	};


	STU.Highlight = Highlight;

	return Highlight;

});

define('StuMiscContent/StuHighlightBe', ['DS/StuMiscContent/StuHighlightBe'], function (Highlight) {
	'use strict';

	return Highlight;
});
