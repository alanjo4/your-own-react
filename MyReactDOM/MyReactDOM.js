import FiberNode from "../MyReactReconciler/MyReactFiber.js"
import { internalState } from "../MyReactGlobalState/MyReactGlobalState.js";
import { isEvent, isProperty, isNew, isGone } from "./utils/MyReactDOMUtils.js";
import { workLoop } from "../MyReactReconciler/MyReactFiberWorkLoop.js"
import { ELEMENT_SYMBOL } from "../MyReact/symbols/symbols.js";
/*
Tiene dos etapas:
Render -> Lógica de saber qué es lo que se va pintar finalmente (Asíncrona y Concurrente - priorización-)
Commit -> La parte donde se añade al dom real (no hay vuelta atrás, síncrono)
*/


function render(element, container) {
	// la raiz en la que se está trabajando actualmente
	// workloop -> Voy a renderizar componentes hasta que el browser. Mientras exista idleTime, entonces hago lógica de renderizado
	// requestIdleCallback -> baja prioridad -> entonces react no puede gestionar REALMENTE que cosas son más prioritarias y que cosas no
	const wipRoot = new FiberNode(
		element, // Esto no es el DOM real como tal
		{ children: [element] },
		null,
		container,
		internalState.getCurrentRoot(),
	);
	// Realizar cambios en el estado de React
	internalState.setWipRoot(wipRoot);
	internalState.setDeletions([]);
	internalState.setNextUnitOfWork(internalState.getWipRoot())
	if (!internalState.getIsWorkLoopRunning()) { // si no estas laburando, entonces te pongo a laburar
		// Algo asincrono -> Scheduler -> requestIdleCallback
		requestIdleCallback(workLoop)
		internalState.setIsWorkLoopRunning(true);
	}
	// crear un estado interno de React -> Prototipos (las clases NO EXISTEN en JS -> sugar syntax)
}

function isValidElement(container) {
	// objeto que lleva el tracking de los elementos {type, props, child}
	return (
		container instanceof Element || container instanceof Document || container instanceof DocumentFragment
	)
}

function createRoot(container, options = {}) {
	// si es valida la raiz
	if (!isValidElement(container)) {
		throw new Error("createRoot(...): Target should be a valid DOM element.")
		// largo un error
	}
	// chequear si hay strictMode
	const isStrictMode = options.isStrictMode || false;

	// un objeto
	const root = {
		dom: container,
		isStrictMode,
		render: (element) => {
			render(element, container)
		}
	}
	/**
	 * dom: container,
	 * isStrictMode
	 * render: (element) => {
	 * 	render(element, container)
	 * }
	 */

	return root;
}

export function commitRoot() {
	const wipRoot = internalState.getWipRoot();
	// Borrado de elementos
	internalState.getDeletions().forEach(commitWork)
	// Pintado de nuevos elementos o elementos actualizados
	commitWork(wipRoot.child);
	internalState.setCurrentRoot(wipRoot);
	internalState.setWipRoot(null);
}

export function commitWork(fiber) {
	if (!fiber) {
	  return;
	}
  
	let domParentFiber = fiber.parent;
	while (!domParentFiber.dom) {
	  domParentFiber = domParentFiber.parent;
	}
	const domParent = domParentFiber.dom;
  
	if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
	  domParent.appendChild(fiber.dom);
	} else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
	  updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === "DELETION") {
	  commitDeletion(fiber, domParent);
	}
  
	commitWork(fiber.child);
	commitWork(fiber.sibling);
  }

function commitDeletion(fiber, domParent) {
	if (fiber.dom) {
		domParent.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child, domParent);
	}
}

export function createDOM(fiber) {
	const dom = fiber.type === "TEXT_ELEMENT" ?
	document.createTextNode("") : document.createElement(fiber.type) ;

	updateDOM(dom, {}, fiber.props);

	return dom;
}

function updateDOM(dom, prevProps, nextProps /** new props */) {
	// Eliminar las propiedades anteriores = Eventos
	Object.keys(prevProps)
		.filter(isEvent) // Filtra solo las propiedades que son eventos
		.filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)) // Filtra los eventos que ya no existen o que han cambiado
		.forEach((name) => {
			const eventType = name.toLowerCase().substring(2); // Obtiene el tipo de evento
			dom.removeEventListener(eventType, prevProps[name]); // Elimina el evento del DOM
		});

	// Elimina las propiedaes anteriores = Props del usuario
	Object.keys(prevProps)
		.filter(isProperty) // Filtra solo las propiedades que no son eventos
		.filter(isGone(prevProps, nextProps)) // Filtra las propiedades que ya no existen en nextProps
		.forEach((name) => {
			dom[name] = ""; // Elimina la propiedad del DOM
		});
	// Agregar las nuevas propiedaes
	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNew(prevProps, nextProps))
		.forEach((name) => {
			dom[name] = nextProps[name];
		});

	// Agregar los eventos nuevos
	Object.keys(nextProps)
		.filter(isEvent)
		.filter(isNew(prevProps, nextProps))
		.forEach((name) => {
			const eventType = name.toLowerCase().substring(2);
			dom.addEventListener(eventType, nextProps[name]);
		});
}


/**
 * 
 * Eliminar las propiedades antiguas
 */

const MyReactDOM = {
	createRoot,
}

export default MyReactDOM;

/**
 * Raiz no recorrido, Renderizado, Pintado
 * 	Hijo 1
 * 		Hijo 1.1
 */

// Doble buffering
// X -> Y -> X
// Y -> X -> Y