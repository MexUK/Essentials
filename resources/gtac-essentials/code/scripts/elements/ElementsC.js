global.elements = {};

elements.isElementOnScreen = (elementId) =>
{
	var element = getElementFromId(elementId);
	var onScreen = element.onScreen;
	util.callServerFunction('elements.isElementOnScreen', elementId, onScreen);
};