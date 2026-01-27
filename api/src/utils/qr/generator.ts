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
