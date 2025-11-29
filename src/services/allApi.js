import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ihamrick.onrender.com/api/",
  }),
  endpoints: (builder) => ({
    getAllVideos: builder.query({
      query: () => "videos/",
    }),
    getAllBlogs: builder.query({
      query: () => "blog/website-blogs",
    }),
    getVideoById: builder.query({
      query: (videoId) => `videos/${videoId}`,
    }),
    getBlogById: builder.query({
      query: (blogId) => `blog/${blogId}`,
    }),
    getAllPublications: builder.query({
      query: () => "publications/website-publications",
    }),
    getPublicationById: builder.query({
      query: (publicationId) => `publications/${publicationId}`,
    }),
    getRecordedPodcasts: builder.query({
      query: () => "/podcasts/recorded",
    }),
    getRecordedPodcastById: builder.query({
      query: (podcastId) => `podcasts/${podcastId}`,
      onQueryStarted: async (podcastId, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(
            "Error during the API call for podcastId:",
            podcastId,
            error
          );
        }
      },
    }),
    getAllPodcast: builder.query({
      query: () => "/podcasts",
    }),
    getLivePodcasts: builder.query({
      query: (liveId) => `/podcasts/${liveId}`,
    }),
    contactUs: builder.mutation({
      query: (newItem) => ({
        url: "/contact/",
        method: "POST",
        body: newItem,
      }),
    }),
    getSearchResults: builder.query({
      query: (keyword) => `/search/?keyword=${keyword}`,
    }),
    // Added life-suggestions API
    getLifeSuggestions: builder.query({
      query: () => "life-suggestions/",
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetAllBlogsQuery,
  useGetVideoByIdQuery,
  useGetBlogByIdQuery,
  useGetAllPublicationsQuery,
  useGetPublicationByIdQuery,
  useGetRecordedPodcastsQuery,
  useGetRecordedPodcastByIdQuery,
  useGetAllPodcastQuery,
  useGetLivePodcastsQuery,
  useContactUsMutation,
  useGetSearchResultsQuery,
  useGetLifeSuggestionsQuery, // Exported hook for the new API
} = allApi;

export default allApi;
