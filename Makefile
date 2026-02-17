deploy:
	npx wrangler deploy
.PHONY: deploy

test:
	npm test
.PHONY: test

fmt:
	npx prettier --write .
.PHONY: fmt
