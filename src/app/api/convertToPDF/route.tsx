import { promises as fs } from "fs"
import { join } from "path"
import { NextResponse, NextRequest } from "next/server"
import puppeteer from "puppeteer"

export async function POST(req: NextRequest, res: NextResponse) {
  // Your logic to get HTML and CSS content from the request
  const body = await req.json()
  const htmlContent = body.htmlContent
  const cssContent = body.cssContent

  //console.log("-------HTML Content--------------------------")
  //console.log(htmlContent)
  //console.log("---------------------------------")

  //console.log("--------CSS Content-------------------------")
  //console.log(cssContent)
  //console.log("---------------------------------")
  // Combine HTML and CSS content
  const combinedContent = `
  <style>${cssContent}</style>${htmlContent}
      `
  console.log("--------Combined Content-------------------------")
  console.log(combinedContent)

  let browser

  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set the content of the page
    await page.setContent(combinedContent)

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })
    //const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" })
    // Send the PDF as a response
    //res.writeHead(200, {
    //  "Content-Type": "application/pdf",
    //  "Content-disposition": `attachment; filename=test.pdf`,

    // Save the PDF to a file on the server
    console.log("PDF is getting written in the file system")
    const pdfFilePath = join(process.cwd(), "public", "generated.pdf")
    await fs.writeFile(pdfFilePath, pdfBuffer)
    //

    console.log("PDF sending back to client")
    const response = new NextResponse(pdfBuffer)
    response.headers.set("content-type", "application/pdf")
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=generated.pdf"
    )
    return response
    // res.setHeader("Content-Type", "application/pdf")
    /*https://stackoverflow.com/questions/63066985/send-file-as-response-using-nextjs-api

    data can be Blob/Stream/Buffer.
    one can also use return new Response(pdfBuffer, { headers: {'content-type': 'application/pdf',
  'Content-Disposition':'attachment; filename=generated.pdf'} })
    return new NextResponse({
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=generated.pdf`,
      },
      body: pdfBuffer,
    })
    */
  } catch (error) {
    console.error("Error during PDF generation:", error)
    return new Response("Internal Server Error").text()
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

export async function GET(res: NextResponse) {
  return new Response("Hello World")
}

/*


export async function POST(request: NextApiRequest) {
  const data = await request.body
  console.log(data)
  return NextApiResponse.json({
    hello: "World",
    data,
  })
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  return NextResponse.json({ data })
}
*/
