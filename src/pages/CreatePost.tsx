import { Helmet } from "react-helmet";
import Editor from "../components/Editor";

const CreatePost = () => {
  return (
    <>
      <Helmet>
        <title>Create Post</title>
      </Helmet>
      <Editor data={null} />
    </>
  );
};

export default CreatePost;
