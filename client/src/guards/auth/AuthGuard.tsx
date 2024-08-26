import { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUserService } from "../../services/auth/auth.services";
import { login } from "../../store/slices/auth-slice";
import { Loading } from "../../components/loading/Loading";

export function AuthGuard() {
    // get param from url

    let token =   localStorage.getItem("jwt");
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    // const user = useSelector((state: AppState) => state.auth.user);
    useEffect(() => {
        if (token) {
            getCurrentUserService(JSON.parse(token).token).then((response) => {
                if (!response) {
                    dispatch(login(null));
                    localStorage.removeItem("jwt");
                    setIsAuthenticated(false);
                }
                if (response.status && response.status !== 200) {
                    dispatch(login(null));
                    localStorage.removeItem("jwt");
                    setIsAuthenticated(false);
                }
        
                setIsAuthenticated(true);
                dispatch(login(response));
                localStorage.setItem('user.data', JSON.stringify({
                    name: response.name,
                    email: response.email,
                    authority: response.authority
                }));

            }).catch(() => {
                localStorage.removeItem("jwt");
                dispatch(login(null));
            })
        }else{
            console.log('no token')
            setIsAuthenticated(false);
        }
    }, [])
    if(isAuthenticated === null){
        return <Loading />
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />
}