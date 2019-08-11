all: pre-commit
	ask deploy -p arumon-alexa

pre-commit:
	cd lambda/custom && ./node_modules/.bin/tsc *.ts data/*.ts

lb: pre-commit
	ask deploy -p arumon-alexa -t lambda

l: pre-commit
	ask lambda upload -f alexa-award-2019-zero -s ./lambda/custom -p arumon-alexa

log:
	ask lambda log --function alexa-award-2019-zero --start-time 1hago -p arumon-alexa

submit:
	$(eval SKILLID := $(shell cat .ask/config | jq '.deploy_settings.default.skill_id'))
	ask api submit --skill-id $(SKILLID) -p arumon-alexa
