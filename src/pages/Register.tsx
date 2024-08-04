import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import AuthSideImg from "../components/AuthSideImg";
import { AuthContext } from "../context/AuthContext";
import { AuthContextValue, ResponseBody } from "../types/types";
import { toast } from "react-toastify";
import { SERVER_URL } from "../constants";
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
    displayPhoto: yup
      .mixed()
      .nullable()
      .test(
        "fileSize",
        "File size must be less than 1MB",
        // Function to check file size

        (file: any) => {
          if (file?.length > 0) {
            return file[0]?.size < 1048576;
          } else {
            return true;
          }
        }
      ),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [displayPhoto, setDisplayPhoto] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token, handleSetToken } = useContext(AuthContext) as AuthContextValue;

  const handleDisplayPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayPhoto(e.target.files);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/?q=my-post");
    }
  }, [token, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const reqData = new FormData();

    reqData.append("username", data.username);
    reqData.append("password", data.password);
    if (displayPhoto) {
      reqData.append("image", displayPhoto[0]);
    }
    try {
      const res = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        body: reqData,
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
        <title> Deyo Blog | Register </title>
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
              Sign up for a new account
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
                <div className="flex items-center gap-10">
                  {displayPhoto && (
                    <img
                      src={URL.createObjectURL(displayPhoto[0])}
                      alt="display_photo"
                      width={"55px"}
                      height={"55px"}
                      className="rounded-full aspect-square flex-none object-cover border-0 ring-1 ring-pri"
                    />
                  )}

                  <label
                    htmlFor="display-photo"
                    className="block text-sm h-10 leading-9 font-medium border-0 ring-1 w-fit px-2 rounded-md hover:ring-pri-hover ring-inset transition-all duration-300 focus:ring-2 focus:ring-pri active:ring-pri text-gray-900 cursor-pointer"
                  >
                    {displayPhoto ? (
                      <span>Change</span>
                    ) : (
                      <span>Add display photo</span>
                    )}
                  </label>
                  {displayPhoto && (
                    <button
                      className="text-red-300 hover:text-red-400 focus:ring-2 focus:ring-red-400 ring-inset border-0 rounded-md px-2 h-10 transition-all duration-300"
                      onClick={() => setDisplayPhoto(null)}
                    >
                      Remove
                    </button>
                  )}

                  <input
                    type="file"
                    id="display-photo"
                    className="absolute -left-[9999px] -top-0 opacity-0"
                    accept="image/png, image/jpeg"
                    {...register("displayPhoto")}
                    onChange={handleDisplayPhoto}
                  />
                </div>
                <p className="text-red-500 italic text-xs md:text-sm">
                  {errors.displayPhoto?.message}.
                </p>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-pri px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pri-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Sign Up
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
              Already a member?{" "}
              <Link
                to={"/login"}
                className="font-semibold leading-6 text-pri hover:text-pri-hover"
              >
                Sign In
              </Link>
            </p>
          </div>
          <p></p>
        </div>
      </main>
    </>
  );
};

export default Register;
