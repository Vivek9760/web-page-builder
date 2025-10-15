
const Loader = ({ isLoading, children }) => {
  return <>{isLoading ? "Loading..." : children}</>;
};

export default Loader;