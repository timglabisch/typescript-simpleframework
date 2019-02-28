run:
	rm -rf build
	tsc -p .
	node build/main.js
