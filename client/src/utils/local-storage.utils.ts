
export const getLocalStorage = <T>(key: string) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : undefined
}

export const setLocalStorage = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
    localStorage.clear()
}

export const getLocalStorageToken = () => {
    const response = localStorage.getItem('jwt')
    const token = response ? JSON.parse(response).token : undefined
    return token
}
