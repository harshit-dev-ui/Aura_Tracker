import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import {
  loginInFailure,
  loginInStart,
  loginInSuccess,
} from "../redux/slices/auth/userSlice";
import { loginUser, handleGoogleSignIn } from "../redux/slices/auth/apiService";
import { store } from "../redux/store";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loading, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [navigate, currentUser]);

  const onSubmit = async (data) => {
    dispatch(loginInStart());
    try {
      const response = await loginUser(data);
      const { _id, email, username } = response;

      dispatch(loginInSuccess({ email, _id, username }));

      console.log(`${response}:Login succesfully`);
      console.log("State after loginInSuccess:", store.getState());
    } catch (error) {
      dispatch(loginInFailure(data));
      console.log(`${data}:Login failed ${error}`);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await handleGoogleSignIn(credentialResponse.credential,dispatch);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign In was unsuccessful. Try again later");
    console.log(error);
  };
  // console.log(import.meta.env.CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login for Aura
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>

            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                type="standard"
                size="large"
                text="signin_with"
                shape="rectangular"
                theme="outline"
                width="383px"
              />
            </div>
          </form>
          <p className="mt-4 text-center">
            Create new account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer"
            >
              Signup
            </span>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
export default Login;
