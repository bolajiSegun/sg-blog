import { Helmet } from "react-helmet";
import Posts from "../components/Posts";

const Home = () => {
  return (
    <>
      <Helmet>
        <title> Deyo Blog </title>
      </Helmet>
      <Posts />
    </>
  );
};

export default Home;
