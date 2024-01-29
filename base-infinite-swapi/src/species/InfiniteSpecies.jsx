import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from '@tanstack/react-query'

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};



export function InfiniteSpecies() {
  const { data,isFetching,fetchNextPage,hasNextPage } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      console.log(lastPage);
      return lastPage.next || undefined
    }
  })
  
  console.log('data',data);
  // TODO: get data for InfiniteScroll via React Query
  return <InfiniteScroll 
  loadMore={() =>{
    if(!isFetching){
      fetchNextPage()
    }
  }}
  hasMore={hasNextPage}
  >
{
  data?.pages.map(pageDatas=>{ return pageDatas.results.map(person =>{
 return  <Species key={person.name} name={person.name} language={person.language} averageLifespan={person.averageLifespan} />
  })})
}

  </InfiniteScroll>;
}
