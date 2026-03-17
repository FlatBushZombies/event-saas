import html2canvas from "html2canvas"
import jsPDF from "jspdf"

type ExportPdfOptions = {
  filename: string
  background?: string
  paddingPx?: number
}

export async function exportElementToPdf(element: HTMLElement, options: ExportPdfOptions) {
  const paddingPx = options.paddingPx ?? 24

  const canvas = await html2canvas(element, {
    backgroundColor: options.background ?? "#fdfbf7",
    scale: Math.min(2, window.devicePixelRatio || 1),
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const maxWidth = pageWidth - paddingPx * 2
  const maxHeight = pageHeight - paddingPx * 2

  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = maxWidth / imgWidth
  const renderWidth = imgWidth * ratio
  const renderHeight = imgHeight * ratio

  const x = (pageWidth - renderWidth) / 2
  const yStart = paddingPx

  if (renderHeight <= maxHeight) {
    const y = (pageHeight - renderHeight) / 2
    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight)
    pdf.save(options.filename)
    return
  }

  // Multi-page: draw the same image with y-offset per page.
  let remaining = renderHeight
  let pageOffset = 0

  while (remaining > 0) {
    const y = yStart - pageOffset
    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight)
    remaining -= maxHeight
    pageOffset += maxHeight
    if (remaining > 0) pdf.addPage()
  }

  pdf.save(options.filename)
}

