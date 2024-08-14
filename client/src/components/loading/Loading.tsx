export function Loading() {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">
                <div className="flex flex-col gap-2 justify-center items-center w-72">
                    {/* <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div> */}
                    <span className="loader"></span>
                </div>
            </div>
        </div>
    )
}