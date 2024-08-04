import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import useGetAPost from "../hooks/useGetAPost";
import { Helmet } from "react-helmet";
import Error from "../components/Error";

const EditPost = () => {
  const { slug } = useParams();

  const { data, error } = useGetAPost(slug!);

  if (error) {
    return <Error />;
  }
  return (
    <>
      {data && (
        <>
          <Editor data={data} />
          <Helmet>
            <title>{"Edit | " + data?.title}</title>
          </Helmet>
        </>
      )}
    </>
  );
};

export default EditPost;
