import './loaders.css'
interface LoadingPageProps {
    progress?: number;
    message?: string;
}
export function LoadingProcess() {
    return <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 z-10"> 
       <span className="loader"></span>
    </div>
}