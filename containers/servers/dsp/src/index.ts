/*
 Copyright 2022 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// DSP
import express, { Application, Request, Response } from "express"

const port = "3000"
const host = process.env.host || "localhost"
const token = process.env.token || ""

const app: Application = express()

app.use((req, res, next) => {
  res.setHeader("Origin-Trial", token)
  next()
})

app.use(
  express.static("src/public", {
    setHeaders: (res: Response, path, stat) => {
      const url = new URL(path, `https://${host}`)
      if (url.pathname.endsWith("bidding_logic.js")) {
        return res.set("X-Allow-FLEDGE", "true")
      }
      if (url.pathname.endsWith("bidding_signal.json")) {
        return res.set("X-Allow-FLEDGE", "true")
      }
    }
  })
)
app.set("view engine", "ejs")
app.set("views", "src/views")

app.get("/", async (req: Request, res: Response) => {
  const title = process.env.DSP_DETAIL
  const host = process.env.DSP_HOST
  const port = process.env.PORT
  const url = new URL(`https://${host}:${port}`)
  const dsp = { title, url }
  res.render("index", { dsp })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
