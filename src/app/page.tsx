"use client"
import { useState, ChangeEvent } from "react"
import axios from "axios"

const Home = () => {
  const [htmlFile, setHtmlFile] = useState<File | null>(null)
  const [cssFile, setCssFile] = useState<File | null>(null)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [cssContent, setCssContent] = useState<string | null>(null)
  const [combinedContent, setCombinedContent] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleHtmlFileChangeHTML = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const content = await e.target.files[0].text()
      setHtmlFile(e.target.files[0])
      setHtmlContent(content)
      combineHtmlAndCss(content, cssContent)
    }
  }

  const handleCssFileChangeCSS = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const content = await e.target.files[0].text()
      setCssFile(e.target.files[0])
      setCssContent(content)
      combineHtmlAndCss(htmlContent, content)
    }
  }

  const combineHtmlAndCss = async (html: string | null, css: string | null) => {
    if (html && css) {
      const combinedContent = `<style>${css}</style>${html}`
      await setCombinedContent(combinedContent)
    }
  }

  const handleConvertToPDF = async () => {
    console.log("Handling PDF conversion...")
    try {
      // console.log("-------Client Side HTML Content--------------------------")
      //console.log(htmlContent)
      //console.log("---------------------------------")

      //console.log("--------Client Side CSS Content-------------------------")
      //console.log(cssContent)
      //console.log("---------------------------------")
      /* prettier-ignore */
      const response = await axios.post("/api/convertToPDF", {
        "htmlContent": htmlContent,
        "cssContent": cssContent,
      }, {
        responseType: "blob", //  This is useful when you're dealing with non-text data, such as images, PDFs, or other binary files.
      })

      //console.log("--------Response from server-------------------------")
      //console.log(response)
      //console.log("------------------------------------------------------")
      //
      if (response.data) {
        // Successful response with data
        console.log("PDF generated successfully!")
        const blob = new Blob([response.data], { type: "application/pdf" })
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = "shreya_resume.pdf"
        link.click()
        window.URL.revokeObjectURL(link.href)
      } else {
        // Handle the case where response.data is undefined
        console.error("PDF generation failed: Response data is undefined")
      }
    } catch (error) {
      console.error("Error during PDF generation:", error)
      // Handle the error as needed
    }
  }
  return (
    <>
      <h1>HTML & CSS to PDF Converter</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ width: "400px", height: "600px", overflow: "auto" }}>
          <h2>HTML Preview:</h2>
          <label>
            Upload HTML File:
            <input
              type="file"
              accept=".html"
              onChange={handleHtmlFileChangeHTML}
            />
          </label>
          {htmlContent && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>

        <div style={{ width: "400px", height: "600px", overflow: "auto" }}>
          <h2>CSS Preview:</h2>
          <label>
            Upload CSS File:
            <input
              type="file"
              accept=".css"
              onChange={handleCssFileChangeCSS}
            />
          </label>
          {cssContent && <pre>{cssContent}</pre>}
        </div>
        <div>
          <h2>Combined Output Preview:</h2>
          {combinedContent && (
            <div>
              <button onClick={handleConvertToPDF}>Convert to PDF</button>
              <div dangerouslySetInnerHTML={{ __html: combinedContent }} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
