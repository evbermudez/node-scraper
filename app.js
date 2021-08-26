const puppeteer = require("puppeteer")

;(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://www.onlinejobs.ph/jobseekers/jobsearch")

    /* Run javascript inside the page */
    const data = await page.evaluate(() => {
        const list = []
        const items = document.querySelectorAll(".results")

        for (const item of items) {
            list.push({
                company: item.querySelector(".jobpost-cat-box a p").innerHTML,
                rate: item.querySelector(".jobpost-cat-box a dd").innerHTML,
                position: item.querySelector(".jobpost-cat-box a dt").innerHTML,
            })
        }

        return list
    })

    console.log(data)
    await browser.close()
})()