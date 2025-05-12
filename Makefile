.PHONY: all
all: check test

# SYSTEM DEPENDENCIES #########################################################

.PHONY: bootstrap
bootstrap: ## Update system dependencies
	@ rm -rf $(TMPDIR)zapier-workspace
	git clone git@gitlab.com:zapier/workspace $(TMPDIR)zapier-workspace --quiet
	BOOTSTRAP_LOG=$(PWD)/bootstrap.log $(TMPDIR)zapier-workspace/bootstrap.sh --skip=docker --skip=python --skip=direnv --skip=infra

# PROJECT DEPENDENCIES ########################################################

INSTALL_FLAG := node_modules/.modules.yaml

.PHONY: install
install: $(INSTALL_FLAG) ## Install project requirements
$(INSTALL_FLAG): pnpm-lock.yaml
ifdef CI
	pnpm install --frozen-lockfile
else
	pnpm install
endif
	@ touch $@

pnpm-lock.yaml: package.json
	pnpm install --lockfile-only
	@ echo

# DEVELOPMENT TASKS ###########################################################

.PHONY: check
check: install ## Run static analysis
	node_modules/.bin/turbo lint
	CI=true node_modules/.bin/turbo typecheck

.PHONY: test
test: install ## Run all tests
	CI=true node_modules/.bin/turbo test

.PHONY: run
run: install ## Start the application
	pnpm dev

# HELP DOCUMENTATION ##########################################################

.PHONY: help
help: install
	@ grep -E '^[a-zA-Z_/-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
