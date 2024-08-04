import { createRef, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import TipTapEditor from "./editor/TipTapEditor";
import { SERVER_URL } from "../constants";
import { AuthContext } from "../context/AuthContext";
import { AuthContextValue, PostType, ResponseBody } from "../types/types";

const Editor = ({ data }: { data: PostType | null }) => {
  const [content, setContent] = useState<string>(data ? data.content : "");
  const [title, setTitle] = useState<string>(data ? data.title : "");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>(data ? data.tags : []);
  const [coverImg, setCoverImg] = useState<any>(null);
  const ref = createRef<HTMLInputElement>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token, user } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTag = () => {
    if (tag.length > 1) {
      if (tag.trim() !== "") {
        setTags([...tags, tag.trim()]);
        setTag(""); // Clear the input after adding a tag
      }
    }
  };
  const handleSetContent = (content: string) => {
    setContent(content);
  };

  const checkRequiredFields = () => {
    if (title.length < 5) {
      toast.error(
        title.length === 0
          ? "Title is required"
          : "Title must be at least 5 characters long"
      );
      return false;
    } else if (content.replace(/<[^>]+>/g, "").length < 10) {
      toast.error(
        content.replace(/<[^>]+>/g, "").length === 0
          ? "Content is required"
          : "Content must be at least 10 characters long"
      );
      return false;
    } else if (coverImg === null && data === null) {
      toast.error("Cover image is required");
      return false;
    } else return true;
  };

  const handleSubmit = async () => {
    const apiUrl = data
      ? `${SERVER_URL}/post/${data.id}`
      : `${SERVER_URL}/post`;
    const apiMethod = data ? "PATCH" : "POST";

    if (checkRequiredFields()) {
      setIsLoading(true);

      try {
        const body = new FormData();

        body.append("title", title);
        body.append("content", content);
        body.append("image", coverImg);

        if (tags.length === 1) {
          body.append("tags", tags[0]);
          body.append("tags", "");
        } else if (tags.length > 1) {
          tags.forEach((tag) => body.append("tags", tag));
        }

        const res = await fetch(apiUrl, {
          method: apiMethod,
          body: body,
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          toast.error("An error occurred");
          setIsLoading(false);
        }
        const data: ResponseBody = await res.json();
        if (data.data) {
          setIsLoading(false);
          toast.success(data.message);
          navigate("/?q=my-post");
        }
      } catch (err: any) {
        setIsLoading(false);
        toast.error(err.message);
      }
    }
  };

  const removeCoverImg = () => {
    setCoverImg(null);
    if (ref.current) {
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (!user) {
      toast.info("Login or Sign up to create or edit post");
      navigate("/login");
    } else {
      if (data && data.authorId !== user?.id) {
        toast.error("Not Authorizated");
        toast.info("Can't edit another authors post");
        navigate("/?q=my-post");
      }
    }
  }, [user, data, navigate]);
  return (
    <>
      <div className="pb-10 px-6 md:px-0 bg-white">
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {" "}
          Title{" "}
        </label>
        <div className="title-container relative w-full h-fit">
          <h1 className="w-full m-0 htitle">{title}</h1>
          <textarea
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            id="title"
            autoFocus
            className="w-full h-full absolute left-0 top-0 bottom-0 right-0 bg-transparent resize-none outline-none px-2 border-0 m-0 p-0"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Tags
          </label>
          <div className="mt-2 flex flex-wrap px-2 items-center border-0 ring-1 ring-inset rounded-md py-1.5 gap-4 min-h-[2.5rem] hover:ring-pri-hover focus-within:ring-2   focus-within:ring-pri transition-all duration-300">
            {tags.map((tg, i) => (
              <div
                key={i}
                className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 gap-2"
              >
                <span>{tg}</span>
                <span
                  onClick={() => removeTag(tg)}
                  className="text-red-300 hover:text-red-500 cursor-pointer"
                >
                  <MinusCircleIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
            ))}

            <input
              type="text"
              id="tags"
              onChange={(e) => setTag(e.target.value)}
              value={tag}
              className="flex-1 outline-none focus:border-b-text-dark text-text-dark "
              placeholder="Tags"
            />
            <button
              className="hover:text-green-400 focus:text-green-500 text-green-300"
              onClick={addTag}
            >
              <PlusCircleIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="tiptap-editor">
          <TipTapEditor content={content} handleSetContent={handleSetContent} />
        </div>

        <div className="mt-4 w-full relative flex gap-4 items-center">
          {coverImg ? (
            <div className="aspect-video max-w-[200px]">
              <img
                src={URL.createObjectURL(coverImg)}
                alt="cover photo"
                className="w-full h-full object-scale-down"
              />
            </div>
          ) : data?.image ? (
            <div className="aspect-video max-w-[200px]">
              <img
                src={data.image}
                alt="cover photo"
                className="w-full h-full object-scale-down"
              />
            </div>
          ) : (
            ""
          )}

          <label
            htmlFor="cover-photo"
            className="block text-sm h-10 leading-9 font-medium border-0 ring-1 w-fit px-2 rounded-md hover:ring-pri-hover ring-inset transition-all duration-300 focus:ring-2 focus:ring-pri active:ring-pri text-gray-900 cursor-pointer"
          >
            {coverImg ? <span>Change</span> : <span>Add a cover photo</span>}
            <input
              type="file"
              name="cover-photo"
              id="cover-photo"
              ref={ref}
              onChange={(e) => setCoverImg(e.target.files && e.target.files[0])}
              accept="image/png, image/jpeg, image/gif"
              className="absolute left-0 top-0 opacity-0 w-full h-full "
            />
          </label>
          {coverImg && (
            <button
              className="text-red-400 hover:text-red-500 ring-inset ring-1 ring-transparent border-0 hover:ring-red-500 rounded-md focus:ring-2 focus:ring-red-500 relative font-medium  text-sm h-10 leading-9 px-2 transition-all duration-300"
              onClick={removeCoverImg}
            >
              Remove
            </button>
          )}
        </div>

        <button
          disabled={isLoading}
          className=" px-3 py-2 w-full flex items-center justify-center sm:max-w-[120px] text-center bg-pri mt-10 text-white rounded-md hover:bg-pri-hover disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleSubmit()}
        >
          save
          {isLoading && (
            <svg
              className="animate-spin relative left-5  h-6 w-6 text-white"
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

        {/* drag & drop */}
        {/* <div className="mb-10 relative w-full aspect-video">
          <label
            htmlFor="coverPhoto"
            className="w-full h-full absolute top-0 left-0  border-4 border-dashed rounded-xl flex justify-center items-center gap-2 flex-col text-text-light"
          >
            <p className="text-xl">Upload a cover photo</p>
            <span className="w-10 inline-block">
              <PhotoIcon />
            </span>
            <p>
              Drag & Drop or{" "}
              <span className="text-pri underline font-medium">Browse</span>
            </p>
            <p className="text-sm">Supports: JPEG, JPG, & PNG</p>
          </label>
          <input
            type="file"
            name="coverPhoto"
            id="coverPhoto"
            className="absolute left-0 top-0 opacity-0 w-full h-full"
          />
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Xy9WLepJJhB3EIn-QsiwOg.jpeg"
            alt="coverPhoto"
            className="w-full absolute left-0 top-0 h-full object-cover"
          />
          <button className="absolute top-4 right-4 w-10 text-red-400 hover:text-red-500">
            <MinusCircleIcon />
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Editor;
