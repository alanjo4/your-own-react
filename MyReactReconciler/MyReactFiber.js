// Fiber/Fibras -> son una estructura de datos que tienen "conciencia" de todo lo que pasa en react (pueden ser pausadas)
function FiberNode(type, props, parent, dom, alternate) {
	this.type = type;
	this.props = props;
	this.parent = parent;
	this.dom = dom;
	this.alternate = alternate;
	this.effectTag = null; // los hooks -> "PLACEMENT": Poner algo, "UPDATE", "DELETION". No solo los hooks, en primera instancia siempre hay un PLACEMENT
	this.child = null;
	this.sibling = null;
}

export default FiberNode;

/*class FiberNode {
	constructor(type, props) {
		...
	}
}*/