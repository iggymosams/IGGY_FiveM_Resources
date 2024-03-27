fx_version("cerulean")

game("gta5")

ui_page("web/build/index.html")

client_script("dist/client/*.client.js")

server_script("dist/server/*.server.js")

files({
	"web/build/index.html",
	"web/build/**/*",
})
