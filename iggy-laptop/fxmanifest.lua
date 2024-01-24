fx_version("cerulean")
name("FiveM TypeScript Boilerplate")
author("Project Error")
game("gta5")

ui_page("web/build/index.html")

server_script("dist/server/**/*.js")
client_script("dist/client/**/*.js")

files({
	"web/build/index.html",
	"web/build/**/*",
})
