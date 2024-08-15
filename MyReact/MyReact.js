import { internalState } from "../MyReactGlobalState/MyReactGlobalState.js";
import { ELEMENT_SYMBOL, FUNCTION_COMPONENT_SYMBOL } from "./symbols/symbols.js";

// createElement
export function createElement(type, props, ...children) {
	let elementType;

	if(typeof type === "string") {
		elementType = ELEMENT_SYMBOL;
	} else if (typeof type === "function") {
		elementType = FUNCTION_COMPONENT_SYMBOL;
	}

	return {
		type,
		props: {
			...props,
			children: children.map((child) => typeof child === "object" ? child
		: createTextElement(child))
		},
		$$typeof: elementType,
	}
}

// createTextElement
export function createTextElement(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
		$$typeof: ELEMENT_SYMBOL,
	}
}

// useState
export function useState(initial) {
	const oldHook = wipFiber.alternate && wipFiber.alternate.hooks
	&& wipFiber.alternate.hooks[hookIndex];

	const hook = {
		state: oldHook ? oldHook.queue : [],
		queue: [],
	}

	const actions = oldHook ? oldHook.queue : [];
	actions.forEach((action) => {
		hook.state = action(hook.state);
	});

	function setState(action) {
		// Logica del setState
		// Se re renderiza el componente
		// No hay poner nada nuevo?
		// no hay que hacer update de nada?
		// no hay que borrar nada?
	}

	return [state, setState];
}

function useEffect(effect, deps) {
	const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
	const hasChanged = oldHook ? !deps.every((dep, index) => dep === oldHook.deps[index]) : true;

	const hook = {
		deps,
	}

	if(hasChanged) {
		effect();
	}

	wipFiber.hooks.push(hook)
	internalState.setHookIndex(hookIndex + 1);
}

const [state, setState] = useState(false)

const MyReact = {
	createElement,
	useState
}

export default MyReact;