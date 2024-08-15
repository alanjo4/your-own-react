export default function MyReactGlobalState() {
	this.wipRoot = null; // fibra
	this.currentRoot = null; // es una fibra
	this.deletions = null; // fibras
	this.nextUnitOfWork = null; // una unidad de trabajo es también una Fibra
	this.wipFiber = null;
	this.hookIndex = null;
	this.isWorkLoopRunning = null; // Es su jornada laboral -> para saber si todavía puedo seguir trabajando en el virtual dom
}

export const internalState = new MyReactGlobalState();

Object.assign(MyReactGlobalState.prototype, {
	getWipRoot: function () {
		return this.wipRoot;
	},
	setWipRoot: function (wipRoot) {
		this.wipRoot = wipRoot;
	},
	getCurrentRoot: function () {
		return this.currentRoot;
	},
	setCurrentRoot: function (currentRoot) {
		this.currentRoot = currentRoot;
	},
	getDeletions: function () {
		return this.deletions;
	},
	setDeletions: function (deletions) {
		this.deletions = deletions;
	},
	getNextUnitOfWork: function () {
		return this.nextUnitOfWork;
	},
	setNextUnitOfWork: function (nextUnitOfWork) {
		this.nextUnitOfWork = nextUnitOfWork;
	},
	getWipFiber: function () {
		return this.wipFiber;
	},
	setWipFiber: function (wipFiber) {
		this.wipFiber = wipFiber;
	},
	getHookIndex: function () {
		return this.hookIndex;
	},
	setHookIndex: function (hookIndex) {
		this.hookIndex = hookIndex;
	},
	getIsWorkLoopRunning: function () {
		return this.isWorkLoopRunning;
	},
	setIsWorkLoopRunning: function (isWorkLoopRunning) {
		this.isWorkLoopRunning = isWorkLoopRunning;
	},
})

/*MyReactGlobalState.prototype.getWipRoot = function() {

}*/

/*const GlobalState = {
	getWipRoot: function() {

	},
}*/