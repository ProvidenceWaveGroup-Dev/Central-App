declare module "jspdf" {
  export default class jsPDF {
    constructor(options?: Record<string, unknown>)
    internal: {
      pageSize: {
        getWidth(): number
        getHeight(): number
      }
    }
    setFillColor(r: number, g: number, b: number): void
    setTextColor(r: number, g: number, b: number): void
    setDrawColor(r: number, g: number, b: number): void
    setFontSize(size: number): void
    setFont(font: string, style: string): void
    rect(x: number, y: number, width: number, height: number, style: string): void
    text(text: string, x: number, y: number, options?: { align?: string }): void
    line(x1: number, y1: number, x2: number, y2: number): void
    save(filename: string): void
  }
}
