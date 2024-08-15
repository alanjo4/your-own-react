import MyReact from "../MyReact/MyReact.js";
import MyReactDOM from "../MyReactDOM/MyReactDOM.js"
debugger;
const rootRealDOM = document.getElementById("root");
const rootFromOurReact = MyReactDOM.createRoot(rootRealDOM);

function Component(props) {
	return (
		<section>
			<h1>{props.title}</h1>
			<div>
				DIV
			</div>
		</section>
	)
}

function App() {
	/** @jsx MyReact.createElement */
	return <Component title="Title" />
	// return MyReact.createElement("section", {title: "Title"})
}


rootFromOurReact.render(App);