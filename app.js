const puppeteer = require("puppeteer")
const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"
let db, jobs

mongo.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("jobs")
        jobs = db.collection("jobs")

        ;(async () => {
            const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage()
            await page.goto("https://www.onlinejobs.ph/jobseekers/jobsearch")

            /* Run javascript inside the page */
            const data = await page.evaluate(() => {
                const list = []
                const items = document.querySelectorAll(".jobpost-cat-box")

                for (const item of items) {
                    list.push({
                        company: item.querySelector(".jobpost-cat-box a p").innerHTML,
                        rate: item.querySelector(".jobpost-cat-box a dd").innerHTML,
                        position: item.querySelector(".jobpost-cat-box a dt h4").innerHTML,
                        link: 'https://www.onlinejobs.ph' + item.querySelector(".jobpost-cat-box a")
                            .getAttribute("href"),
                    })
                }

                return list
            })

            console.log(data)
            jobs.deleteMany({})
            jobs.insertMany(data)
            await browser.close()
        })()
    }
)