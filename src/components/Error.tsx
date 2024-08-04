const Error = () => {
  return (
    <div className="grid gap-4 place-content-center h-[300px]">
      <p className="text-2xl md:text-4xl font-semibold text-text-dark">
        Error While Fetching Data
      </p>
      <button
        className="px-3 font-medium w-fit mx-auto py-1.5 rounded-md ring-1 ring-text-light ring-inset text-text-light hover:ring-pri-hover hover:text-pri-hover focus:ring-2 focus:ring-pri-hover active:bg-pri active:text-white transition-all duration-300"
        onClick={() => window.location.reload()}
      >
        Tap here to retry
      </button>
    </div>
  );
};

export default Error;
