import { useState } from "react";
import { authService } from "../../services/auth/auth.services";
import { login } from "../../store/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLoading } from "../../store/slices/is-loading.slice";

export function Auth() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state: any) => state.isLoading.isLoading);
    function handleInputsChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dispatch(setIsLoading({
            isLoading: true,
            message: 'Authenticating...'
        }));
        authService(credentials.username, credentials.password).then((response) => {
            dispatch(setIsLoading({
                isLoading: false,
                message: ''
            }));
            if (!response) {
                return setError('Username or password incorrect');
            }
            if (response.status && response.status !== 200) {
                return setError(response.message);
            }
            console.log(response)
            dispatch(login(response));
            localStorage.setItem('jwt', JSON.stringify({
                token: response.token,
                refreshToken: response.refreshToken
            }));

           
           response.authority === 'TENANT_ADMIN' ? navigate('/select', { replace: true }) : navigate('/dashboard');
          
        }).catch((_error) => {
            dispatch(setIsLoading({
                isLoading: false,
                message: ''
            }));
            setError('An error occurred, please try again later');
        })
    }

    return (
        <>
            {isLoading && <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(255,255,255,0.8)] bg-opacity-50 flex items-center justify-center z-50">
                <div className=" p-5 rounded-md">
                    <div className="flex flex-col gap-4 justify-center items-center w-72 ">
                        <p className="font-bold">Authenticating...</p>
                        <span className="loader"></span>
                    </div>
                </div>
            </div>}
            <main className="flex items-center justify-center w-full h-[100vh] bg-gray-100 ">
                <div className="bg-white p-10 rounded-md shadow-md w-96 ">
                    <div className="mb-5">
                        <h1 className="text-2xl font-semibold text-gray-600">Sign in</h1>
                        <small className="text-gray-400">Sign in to your account</small>
                        {error && <div className="bg-red-100 text-red-500 p-2 border-l-2 border-red-500 mt-2 text-sm">{error}</div>}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="username" className="text-sm text-gray-500">Username</label>
                            <input type="text"
                                placeholder="example@lumenenergysolutions.com"
                                name="username" id="username" className="w-full mt-1 p-2 border border-gray-200 rounded-md outline-none" onChange={handleInputsChange} />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="text-sm text-gray-500">Password</label>
                            <input type="password" name="password"
                                placeholder="************"
                                id="password" className="w-full mt-1 p-2 border border-gray-200 rounded-md outline-none" onChange={handleInputsChange} />
                        </div>
                        <div className="mb-5">
                            <button className="w-full bg-blue-500 text-white p-2 rounded-md">Sign In</button>
                        </div>
                    </form>


                </div>
            </main>

        </>
    );
}