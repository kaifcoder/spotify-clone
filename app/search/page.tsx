import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";

interface searchProps {
  searchParams: {
    title: String;
  };
}

const Search = async ({ searchParams }: searchProps) => {
  const songs = await getSongsByTitle(searchParams.title);
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="flex flex-col mb-2 gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
    </div>
  );
};

export default Search;