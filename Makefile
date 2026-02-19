wrangler.jsonc:
	@test -n "$(DATABASE_ID)" || (echo "DATABASE_ID is not set"; exit 1)
	sed 's/DATABASE_ID/$(DATABASE_ID)/' wrangler.example.jsonc > wrangler.jsonc
.PHONY: wrangler.jsonc

deploy: wrangler.jsonc
	npx wrangler deploy
.PHONY: deploy

test:
	npm test
.PHONY: test

fmt:
	npx prettier --write .
.PHONY: fmt
