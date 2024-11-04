import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { makeAPIRequest } from "../service/postdetail";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { debounce } from "lodash";

const PostDetail = () => {
  const [pages, setPage] = useState(0);
  //   const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [contentHeight, setContentHeight] = useState(0);
//   const [scrollOffset, setScrollOffset] = useState(0);

  const {
    data,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    promise,
    ...result
  } = useInfiniteQuery({
    queryKey: ["pp"],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 3,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      // console.log("last page",lastPage.page);

      return lastPage?.page - 1;
    },

    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => {
      console.log("firstPage",firstPage.page);
         if(firstPage.page==1) return
         console.log("after",firstPage.page);
         
      return  firstPage?.page + 1;
    },
  });

//   console.log("dta",data);  

  const allItems = useMemo(()=>data?.pages.flatMap((page) => page.data) || [],[data]);

  useEffect(() => {
  console.log("allitems",allItems);
  
  }, [allItems])
  
  const scrollOffset = useRef(0);
  const scrollContentOffsetY = useRef(0);

  const CancelToken = axios.CancelToken;
  let cancel;

  const fetchPage = async (pageParam) => {
    console.log("pageParam", pageParam);
    const url =
      pageParam == 0
        ? `https://api.websitetoolbox.com/v1/api/posts?topicId=12804902&includeId=1341021233&expand=Category&expand=Topic&limit=10`
        : `https://api.websitetoolbox.com/v1/api/posts?topicId=12804902&page=${pageParam}&expand=Category&expand=Topic&limit=10`;
    const res = await makeAPIRequest(url);
    // console.log("res", res);

    return res;
  };

  const createCancelTokenSource = () => {
    if (cancel) {
      cancel("Request canceled by user");
    }
    cancel = CancelToken.source();
    return cancel.token;
  };

  const fetchPost = async () => {
    if (loader) return;
    console.log("in API");

    setLoader(true);
    const url =
      pages == 0
        ? `https://api.websitetoolbox.com/v1/api/posts?topicId=12804902&includeId=1341021233&expand=Category&expand=Topic&limit=10`
        : `https://api.websitetoolbox.com/v1/api/posts?topicId=12804902&page=${pages}&expand=Category&expand=Topic&limit=10`;
    const res = await makeAPIRequest(url, createCancelTokenSource);
    // console.log("====================================");
    // console.log(res); 
    // console.log("====================================");
    setData((prev) => [...res.data, ...prev]);
    setLoader(false);
  };

  const handleScroll = async ({ nativeEvent }: any) => {
    if (isLoading) return;
    scrollOffset.current = nativeEvent.contentOffset.y;
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    const isScrolledToTop = contentOffset.y < 40 && contentOffset.y > 1;
    if (isScrolledToTop && scrollContentOffsetY.current > contentOffset.y) {
      const offsetBefore = scrollOffset.current;
      console.log("runnnnnn");
      fetchPreviousPage();
      // Scroll to maintain the exact position by adjusting based on the added height
      // setTimeout(() => {
      //   postDataRef.current?.scrollToOffset({
      //     offset: offsetBefore + addedHeight, // Adjust for the added height
      //     animated: false,
      //   });
      // }, 0);
    }
    scrollContentOffsetY.current = contentOffset.y;
  };

  //   useEffect(() => {
  //     fetchPost();
  //   }, [pages]);
  

  // const handleScroll = async ({ nativeEvent }) => {
  //   if (isLoading) return;
  //   const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    
  //   // Scroll check: near the top (trigger previous page load)
  //   const isScrolledToTop = contentOffset.y < 100; // Increase threshold to fine-tune
  //   if (isScrolledToTop && scrollContentOffsetY.current > contentOffset.y && !isFetchingPreviousPage) {
  //   //   await fetchPreviousPage();
  //  await handlePrevious()
    
  //   }
    
  //   scrollContentOffsetY.current = contentOffset.y;
  // };

  const Post = ({ item }) => {
    // console.log("item",item); 
    return (
      <View
        style={{
          backgroundColor: "#eee",
          marginBottom: 10,
          paddingVertical: 20,
          paddingHorizontal:10
        }}   
      >
        <Text style={{ color: "#000" }}>{item?.message}</Text>
      </View>
    );
  };

//   console.log("all items",allItems);

//   const handlePrevious=async()=>{
//     console.log("jjj");
    
//     !isFetchingPreviousPage && await fetchPreviousPage()
//   }
const handlePrevious = debounce(async () => {
    console.log("Fetching previous page...");
    if (!isFetchingPreviousPage) {
      await fetchPreviousPage();
    }
  }, 1500);  // Debounce for 500 milliseconds

  return (
    <View style={styles.container}>
      <FlatList
        data={allItems}
        // estimatedItemSize={150}
        // initialScrollIndex={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item})=><Post item={item}/>}
        onScroll={handleScroll}
        // onStartReached={()=>handlePrevious()}
        // maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        // removeClippedSubviews={false}
        // getItemType={(item) => item.type}
        //inverted
        onEndReached={async()=>!isFetchingNextPage && await fetchNextPage()}
      />
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});
