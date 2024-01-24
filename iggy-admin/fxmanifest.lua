fx_version("cerulean")

game("gta5")

name("iggy-admin-svelte")

client_script("dist/client/*.client.js")

server_script("dist/server/*.server.js")

ui_page("web/build/index.html")

files({
	"web/build/index.html",
	"web/build/**/*",
})
