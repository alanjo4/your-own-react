import FiberNode from "./MyReactFiber.js";

export function reconcileChildren(wipFiber, elements) {
	let index = 0;
	// usa el doble buffering para chequear la existencia y guarda el valor de child si existe
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling = null;

	while (index < elements.length || oldFiber !== null) {
		const element = elements[index];
		let newFiber = null;

		const sameType = oldFiber && element && element.type == oldFiber.type;

		if (sameType) {
			newFiber = oldFiber;
			newFiber.props = element.props;
			newFiber.effectTag = "UPDATE";
		}

		// Crear un nuevo Fiber si el tipo ha cambiado
		if (element && !sameType) {
			newFiber = new FiberNode(
				element.type,
				element.props,
				wipFiber,
				null,
				null
			);
			newFiber.effectTag = "PLACEMENT";
		}

		// Marcar los Fibers antiguos para eliminación si no hay un tipo coincidente
		if (oldFiber && !sameType) {
			oldFiber.effectTag = "DELETION";
			internalState.setDeletions(internalState.getDeletions().push(oldFiber));
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (index === 0) {
			wipFiber.child = newFiber;
		} else if (element) {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
		index++;
	}
}