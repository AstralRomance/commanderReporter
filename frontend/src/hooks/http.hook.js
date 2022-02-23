import {useState, useCallback} from 'react'


export const useHttp = () => {
    const [loading, setLoading] = useState(false)

    const request = useCallback(async (url, method = 'GET', body=null) => {
        setLoading(true)    
        
        try{
                const response = await fetch(url, {method, body})
                const data = await response.json()

                if (!response.ok){
                    throw new Error(data.message || 'Something wrong')
                }
                setLoading(false)
                return data

            } catch (e) {
                setLoading(false)
                throw e
            }
    }, [])

    return {loading, request}
}