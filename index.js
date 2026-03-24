import app from "./src/app.js"

const host = "0.0.0.0"
const port = app.get("port")

app.listen(port, host, () => {
  console.log(`Mailing API listening on http://localhost:${port}`)
})

export { app }
