import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allApi = createApi({
  reducerPath: "allApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.20.73:5005/api/",
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

    contactUs: builder.mutation({
      query: (newItem) => ({
        url: "/contact/",
        method: "POST",
        body: newItem,
      }),
    }),
  }),
});

// Export the hooks for use in components
export const {
  useGetAllVideosQuery,
  useGetAllBlogsQuery,
  useGetVideoByIdQuery,
  useGetBlogByIdQuery,
  useGetAllPublicationsQuery,
  useGetPublicationByIdQuery,
  useContactUsMutation,
} = allApi;

export default allApi;
