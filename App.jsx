function App() {
	return (
		// Existe en JS?
		// Esto es JSX
		<h1 id="title">Hello World</h1>
	)
}

const objetoModeloDeReact = {
	type: "h1",
	{
		id="title"
	},
	child: "Hello World"
}

/*
function AppTwo() {
		React.createElement({
			type: "h1",
			{
				id="title"
			},
			children: React.createElement(type...)
			}
		)
}*/