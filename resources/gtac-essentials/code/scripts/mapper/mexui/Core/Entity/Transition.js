mexui.Entity.Transition = function()
{
	this.processing				= false;
	this.interpolating			= false;
	this.mainToPseudoProgress	= 0.0;
	this.delayTimer				= null;
	this.transitionDelay		= mexui.Entity.Transition.defaultTransitionDelay;
	this.transitionTime			= mexui.Entity.Transition.defaultTransitionTime;
	this.mouseIsEntered			= false;
	this.lastUpdateTime			= mexui.util.time();
	this.direction				= true;
};

// static
mexui.Entity.Transition.defaultTransitionDelay	= 0;
mexui.Entity.Transition.defaultTransitionTime	= 1000;//400;

// custom events
mexui.Entity.Transition.prototype.onMouseEnter = function(transitionDelay, transitionTime)
{
	if(this.isMouseEntered())
		return;
	this.setMouseEntered(true);
	
	this.transitionDelay = transitionDelay;
	this.transitionTime = transitionTime;
	
	if(transitionDelay > 0)
	{
		this.startDelay();
	}
	else if(this.isInterpolating())
	{
		this.revertInterpolationDirection();
	}
	else
	{
		this.startEnterInterpolation();
	}
};

mexui.Entity.Transition.prototype.onMouseExit = function()
{
	if(!this.isMouseEntered())
		return;
	this.setMouseEntered(false);
	
	if(this.isDelayActive())
	{
		this.clearDelayTimer();
	}
	else if(this.isInterpolating())
	{
		this.revertInterpolationDirection();
	}
	else
	{
		this.startExitInterpolation();
	}
};

// model
mexui.Entity.Transition.prototype.setMouseEntered = function(status)
{
	this.mouseIsEntered = status;
};

mexui.Entity.Transition.prototype.isMouseEntered = function()
{
	return this.mouseIsEntered;
};

// processing
mexui.Entity.Transition.prototype.isProcessing = function()
{
	return this.processing;
};

mexui.Entity.Transition.prototype.stopProcessing = function()
{
	if(this.isInterpolating())
	{
		this.stopInterpolation();
	}
	
	this.delayTimer			= null;
	this.processing			= false;
};

// interpolation status
mexui.Entity.Transition.prototype.startEnterInterpolation = function()
{
	this.lastUpdateTime = mexui.util.time();
	this.processing = true;
	this.interpolating = true;
	this.direction = true;
	this.mainToPseudoProgress = 0.0;
};

mexui.Entity.Transition.prototype.startExitInterpolation = function()
{
	this.lastUpdateTime = mexui.util.time();
	this.processing = true;
	this.interpolating = true;
	this.direction = false;
	this.mainToPseudoProgress = 1.0;
};

mexui.Entity.Transition.prototype.stopInterpolation = function()
{
	this.interpolating = false;
};

mexui.Entity.Transition.prototype.isInterpolating = function()
{
	return this.interpolating;
};

// interpolation direction
mexui.Entity.Transition.prototype.revertInterpolationDirection = function()
{
	this.lastUpdateTime = mexui.util.time();
	this.direction = !this.direction;
};

// progress
mexui.Entity.Transition.prototype.increaseMainToPseudoProgress = function()
{
	var timeDiff = mexui.util.time() - this.lastUpdateTime;
	this.lastUpdateTime = mexui.util.time();
	var progressDiff = timeDiff / this.transitionTime;
	
	if(this.direction)
		this.mainToPseudoProgress += progressDiff;
	else
		this.mainToPseudoProgress -= progressDiff;
	
	if(this.mainToPseudoProgress < 0.0)
	{
		this.mainToPseudoProgress = 0.0;
		this.stopProcessing();
	}
	else if(this.mainToPseudoProgress > 1.0)
	{
		this.mainToPseudoProgress = 1.0;
	}
};

mexui.Entity.Transition.prototype.getMainToPseudoProgress = function()
{
	this.increaseMainToPseudoProgress();
	
	return this.mainToPseudoProgress;
};

mexui.Entity.Transition.prototype.getCompletionProgress = function()
{
	if(this.direction)
		return this.mainToPseudoProgress;
	else
		return 1.0 - this.mainToPseudoProgress;
};

mexui.Entity.Transition.prototype.startDelay = function()
{
	var that = this;
	this.delayTimer = setTimeout(function()
	{
		that.delayTimer = null;
		that.startEnterInterpolation.call(that);
	}, this.transitionDelay);
};

mexui.Entity.Transition.prototype.isDelayActive = function()
{
	return this.delayTimer != null;
};

mexui.Entity.Transition.prototype.clearDelayTimer = function()
{
	clearTimeout(this.delayTimer);
	this.delayTimer = null;
};

