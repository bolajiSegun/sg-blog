import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import AuthSideImg from "../components/AuthSideImg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthContextValue, ResponseBody } from "../types/types";
import { SERVER_URL } from "../constants";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const schema = yup
  .object({
    username: yup.string().min(4).required(),
    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "Password must contain at least one uppercase and one lowercase letter"
      )
      .required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { token, handleSetToken } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/?q=my-post");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData: ResponseBody = await res.json();

      if (!res.ok) {
        toast.error(resData.message);
        setIsLoading(false);
      }
      if (resData.data) {
        toast.success(resData.message);
        handleSetToken(resData.data?.token);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Helmet>
        <title> Deyo Blog | Login </title>
      </Helmet>
      <main className="lg:flex h-screen min-h-[600px]">
        <AuthSideImg />
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="/img/dt.png"
              alt="dt-blogs"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    autoComplete="username"
                    {...register("username")}
                    autoFocus
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 outline-none sm:text-sm sm:leading-6 px-2 ${
                      errors.username
                        ? "focus:ring-red-500 ring-red-500"
                        : "focus:ring-pri ring-gray-300"
                    }`}
                  />
                </div>
                <p className="text-red-500 italic text-xs md:text-sm">
                  {errors.username?.message}.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-pri hover:text-pri-hover"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 outline-none sm:text-sm sm:leading-6 px-2 ${
                      errors.password
                        ? "focus:ring-red-500 ring-red-500"
                        : "focus:ring-pri ring-gray-300"
                    }`}
                  />
                </div>
                <p className="text-red-500 italic text-xs md:text-sm">
                  {errors.password?.message}.
                </p>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-pri px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pri-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Sign in
                  {isLoading && (
                    <svg
                      className="animate-spin relative left-10  h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                to={"/register"}
                className="font-semibold leading-6 text-pri hover:text-pri-hover"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
