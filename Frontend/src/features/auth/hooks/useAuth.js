import { useDispatch } from "react-redux";
import { getMe, login, register } from "../service/auth.api"
import { setError, setLoading, setUser } from "../auth.slice";

export const useAuth = ()=>{

    const dispatch = useDispatch();

    const handleRegister = async ({username,email,password})=>{
        try {
            dispatch(setLoading(true))
            const data = await register({username,email,password})
            dispatch(setUser(data.user)); 

            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))

            return false;
        } finally{
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async ({email,password}) =>{
        try {
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))

            return true;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))

            return false;
        } finally{
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async ()=>{
        try {
            dispatch(setLoading(true))
            const data = await getMe();
            dispatch(setUser(data.user))

            return true

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))

            return false
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleVerifyEmail = async (token) => {
        try {
            dispatch(setLoading(true));

            await verifyEmail(token);

            return true;
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Verification failed"
                )
            );

            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleVerifyEmail
    }
}