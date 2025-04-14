export function LoadingPage() {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 dark:text-white text-gray-900 text-center z-50">
       
            <div className="loader">
                <div className="square" id="sq1"></div>
                <div className="square" id="sq2"></div>
                <div className="square" id="sq3"></div>
                <div className="square" id="sq4"></div>
                <div className="square" id="sq5"></div>
                <div className="square" id="sq6"></div>
                <div className="square" id="sq7"></div>
                <div className="square" id="sq8"></div>
                <div className="square" id="sq9"></div>
            </div>
        </div>
    )
}