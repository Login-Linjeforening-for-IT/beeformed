/* async function getWrapper({ path, options = {}, custom }: GetWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        console.log(error)
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function postWrapper({ path, data, custom }: PostWrapper) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }

    try {
        const response = await fetch(`${url}${path}`, defaultOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        console.log(error)
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function deleteWrapper({ path, options, custom }: DeleteWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

async function patchWrapper({ path, data = {}, options = {}, custom }: PatchWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
} */