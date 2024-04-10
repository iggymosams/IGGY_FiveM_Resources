fx_version("cerulean")

game("gta5")

name("iggy-groups")

client_script("dist/client/*.client.js")

server_script("dist/server/*.server.js")

dependencies({
	"iggy-utils",
	"iggy-laptop",
})
