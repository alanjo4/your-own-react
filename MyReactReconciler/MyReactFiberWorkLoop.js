import { internalState } from "../MyReactGlobalState/MyReactGlobalState.js";
import { reconcileChildren } from "./MyReactFiberReconciler.js"
import { createDOM, commitRoot } from "../MyReactDOM/MyReactDOM.js";

export function workLoop(deadline) {
	//Tengo tiempo? Tengo deadline? entonces seguir laburando, si no workLoopRunning = false

	let shouldYield = false;

	let nextUnitOfWork = internalState.getNextUnitOfWork();

	while(nextUnitOfWork && !shouldYield) {
		const updatedNextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		internalState.setNextUnitOfWork(updatedNextUnitOfWork);
		// Empezar a renderizar y laburar la lógica de las fibras/componentes
		// performUnitOfWork()
		shouldYield = deadline.timeRemaining() < 1;

		nextUnitOfWork = updatedNextUnitOfWork;
	}

	const wipRoot = internalState.getWipRoot();

	if(!nextUnitOfWork && wipRoot) {
		// ya se terminó, ya no hay nada más por trabajar
		// La etapa del pintado -> commit -> pintar
		commitRoot()
		internalState.setIsWorkLoopRunning(false)
	} else {
		requestIdleCallback(workLoop);
	}
}

export function performUnitOfWork(fiber) {
	const isFunctionComponent = fiber.type instanceof Function;

	if(isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	if(fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;

	while(nextFiber) {
		if(nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
}

function updateFunctionComponent(fiber) {
	const wipFiber = fiber;
	wipFiber.hooks = [];
	internalState.setWipFiber(fiber);
	internalState.setHookIndex(0);
	const children = [fiber.type(fiber.props)];
	// reconciler
	reconcileChildren(fiber, children);
}

// Elementos de HTML
function updateHostComponent(fiber) {
	if(!fiber.dom) {
		fiber.dom = createDOM(fiber);
	}
	// reconciler <h1>Hello</h1> -> Hello = children
	reconcileChildren(fiber, fiber.props.children);
}