import { useEffect, useState } from "react"
import { GetAssetGroupService } from "../../services/assets/asset.services"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setAsset } from "../../store/slices/asset.slice"
import { setCustomer } from "../../store/slices/customer.slice"

export function SelectAsset() {
    const [assets, setAssets] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        GetAssetGroupService().then((response) => {
            if(response.length === 1) {
               
                dispatch(setCustomer(response[0]))
                navigate('/dashboard?customer=' + response[0].id.id)
            }
            setAssets(response)

        })
    }, [])

    const dispatch = useDispatch()

    const handleSelectAsset = (asset: any) => {
        dispatch(setAsset(asset))
        navigate('/dashboard?customer=' + asset.id.id)
    }
    return (

        <>

            <div className="w-full h-[100vh] flex items-center justify-center bg-gray-100">

                <div className="text-center">
                    <h2 className="text-3xl font-bold">
                        Welcome to Lumen Billing
                    </h2>
                    <p className="text-gray-500 mt-4">
                        Please select a branch to start
                    </p>
                    <div className="flex items-center justify-center mt-10 flex-wrap gap-10">
                        {assets.map((asset: any, index: number) => (
                            <div
                                onClick={() => handleSelectAsset(asset)}
                                key={index} className="bg-white flex flex-col min-w-[12rem] items-center justify-center p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg">
                                {
                                    asset.img ? (
                                        <img src={asset.img} alt="logo" className="w-20 h-20 object-contain rounded-md" />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md">
                                            <span className="text-gray-400 text-2xl">{asset.name.charAt(0)}</span>
                                        </div>
                                    )
                                }
                                <h3 className="text-lg font-bold mt-2 text-gray-500 text-wrap">{asset.name}</h3>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    )
}