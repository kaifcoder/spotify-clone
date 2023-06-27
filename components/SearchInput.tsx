"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);
  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl({
      url: "/search",
      query: query,
    });
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      value={value}
      placeholder="what do you want to listen to?"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
