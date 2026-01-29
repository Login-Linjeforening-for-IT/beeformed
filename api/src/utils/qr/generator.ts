import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
    data: string
    size?: number
}

export default async function generateQRCode({ data, size = 150 }: QRCodeGeneratorProps): Promise<string | null> {
    if (!data) return null

    try {
        const qrDataURL = await QRCode.toDataURL(data, {
            width: size,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })
        return qrDataURL
    } catch (error) {
        console.error('QR Code generation error:', error)
        return null
    }
}

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

        let table = `<table style="border:0;border-collapse:collapse;background-color:transparent;width:${totalSize}px;height:${totalSize}px;margin:0 auto;" cellspacing="0" cellpadding="0" border="0">`
        
        for (let r = 0; r < size; r++) {
            table += `<tr style="padding:0;margin:0;border:0;height:${moduleSize}px;">`
            for (let c = 0; c < size; c++) {
                const isDarkModule = isDark(r, c)
                
                if (isDarkModule) {
                    const msoHack = `mso-style-textfill-type:gradient;mso-style-textfill-fill-gradientfill-stoplist:"0 #000000 1 100000,99000 #000000 1 100000";color:#000000 !important;`
                    
                    table += `<td style="width:${moduleSize}px;height:${moduleSize}px;padding:0;margin:0;border:0;vertical-align:top;font-family:Arial,sans-serif;line-height:${moduleSize}px;mso-line-height-rule:exactly;font-size:${moduleSize}px;${msoHack}">&#9608;</td>`
                } else {
                    table += `<td style="width:${moduleSize}px;height:${moduleSize}px;padding:0;border:0;line-height:0;font-size:0;"></td>`
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
