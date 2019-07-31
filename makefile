.PHONY: install
install:
	npm install

.PHONY: clean
clean:
	rm -f build/*

.PHONY: init
init:
	@npm install --silent
	@npm run build --silent
	@npm run start --silent

.PHONY: start
start:
	@npm run start --silent

.PHONY: deploy
delpoy:
	git push heroku master