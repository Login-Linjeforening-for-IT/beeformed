import QRCode from 'qrcode'

export async function generateQRCodeHtml({ data }: { data: string }): Promise<string | null> {
    if (!data) return null

    try {
        const qr = QRCode.create(data, { errorCorrectionLevel: 'M' })
        const modules = qr.modules
        const size = modules.size
        
        const moduleSize = 4
        const totalSize = size * moduleSize
        
        function isDark(r: number, c: number) {
            if (modules.data) return !!modules.data[r * size + c]
            return modules.get(c, r)
        }

        let table = `<table role="presentation" width="${totalSize}" height="${totalSize}" align="center" style="border-collapse:separate;border-spacing:0;width:${totalSize}px;height:${totalSize}px;margin:0 auto;" cellspacing="0" cellpadding="0" border="0">`
        
        for (let r = 0; r < size; r++) {
            table += `<tr>`
            for (let c = 0; c < size; c++) {
                const isDarkModule = isDark(r, c)
                
                if (isDarkModule) {
                    table += `<td style="width:${moduleSize}px;height:${moduleSize}px;border:${moduleSize / 2}px solid #000000;padding:0;font-size:0;line-height:0;"></td>`
                } else {
                    table += `<td style="width:${moduleSize}px;height:${moduleSize}px;border:${moduleSize / 2}px solid #ffffff;padding:0;font-size:0;line-height:0;"></td>`
                }
            }
            table += '</tr>'
        }
        table += '</table>'
        return table
    } catch (error) {
        console.error('QR Code HTML generation error:', error)
        return null
    }
}
