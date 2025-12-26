import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.pg-65.com/api/", // Ensure that the correct base URL is used
  }),
  endpoints: (builder) => ({
    getAllVideos: builder.query({
      query: ({ sortBy, sortOrder }) =>
        `videos/?sortBy=${sortBy}&sortOrder=${sortOrder}`,
    }),
    getAllBlogs: builder.query({
      query: ({ sortBy, sortOrder }) =>
        `blog/website-blogs?sortBy=${sortBy}&sortOrder=${sortOrder}`,
    }),
    getVideoById: builder.query({
      query: (videoId) => `videos/watch/${videoId}`,
    }),
    getBlogById: builder.query({
      query: (blogId) => `blog/website-blogs/${blogId}`,
    }),
    getAllPublications: builder.query({
      query: ({ sortBy, sortOrder }) =>
        `publications/website-publications?sortBy=${sortBy}&sortOrder=${sortOrder}`,
    }),
    getPublicationById: builder.query({
      query: (publicationId) => `publications/${publicationId}`,
    }),
    getRecordedPodcasts: builder.query({
      query: ({ sortBy, sortOrder }) =>
        `/podcasts/recorded?sortBy=${sortBy}&sortOrder=${sortOrder}`,
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
      query: ({ sortBy, sortOrder }) =>
        `/podcasts?sortBy=${sortBy}&sortOrder=${sortOrder}`,
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
    getLifeSuggestions: builder.query({
      query: () => "life-suggestions/",
    }),
    getAllSocialMediaLinks: builder.query({
      query: () => "/social-links",
    }),
    addRssUser: builder.mutation({
      query: (data) => ({
        url: "/rss-feed/add-data",
        method: "POST",
        body: data,
      }),
    }),
    getAboutUs: builder.query({
      query: () => "website-content/about-us",
    }),
    getPrivacyPolicy: builder.query({
      query: () => "website-content/privacy-policy",
    }),
    getAdminInfo: builder.query({
      query: () => "/auth/admin-info",
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
  useGetLifeSuggestionsQuery,
  useGetAllSocialMediaLinksQuery,
  useAddRssUserMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useGetAdminInfoQuery,
} = allApi;

export default allApi;
