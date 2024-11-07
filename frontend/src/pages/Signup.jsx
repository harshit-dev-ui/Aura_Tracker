import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../redux/slices/auth/userSlice";
import {
  registerUser,
  handleGoogleSignIn,
} from "../redux/slices/auth/apiService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { loading, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [navigate, currentUser]);
  const onSubmit = async (data) => {
    const requestData = {
      username: data.username,
      email: data.email.toLowerCase(),
      password: data.password,
    };
    dispatch(signUpStart());
    try {
      const response = await registerUser(requestData);
      dispatch(signUpSuccess(response));
      localStorage.setItem("token", response.token);
      console.log(`${response}: Signup successful`);
    } catch (error) {
      dispatch(signUpFailure(data));
      console.log(`Signup failed: ${error}`);
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
 
      console.log("Google Sign-In Success:", credentialResponse);
  
      if (credentialResponse?.credential) {
        console.log("Google Token:", credentialResponse.credential);
  
        await handleGoogleSignIn(credentialResponse.credential, dispatch);
        navigate("/dashboard");
      } else {
        console.error("Credential not found in Google response.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };
  
  const handleGoogleFailure = (error) => {
    console.error("Google Sign In was unsuccessful. Try again later", error);
    console.log(error);
  };
  
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Sign up for Aura
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "User Name is required" })}
              required
              className="w-full px-4 py-2 border rounded-md"
            />

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
              Sign Up
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
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
