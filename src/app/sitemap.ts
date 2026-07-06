import { MetadataRoute } from "next";
import { BlogDB } from "@/lib/db";
import { supabase } from "@/lib/supabase"; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://udaancare.in";

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/book`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/bootcamp`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/services/occupational-therapy`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/services/pediatric-therapy`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/services/sensory-integration`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/services/online-therapy`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/international`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/join-as-therapist`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/links`, lastModified: new Date(), priority: 0.6 },
  ];

  try {
    const blogs = await BlogDB.getAll();
    const publishedBlogs = blogs.filter(b => b.published);
    publishedBlogs.forEach((blog) => {
      routes.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
        priority: 0.7,
      });
    });
  } catch (e) {
    console.error("Sitemap: error fetching blogs", e);
  }

  try {
    const { data: bootcamps } = await supabase
      .from("bootcamps")
      .select("slug, updated_at")
      .eq("isPublished", true)
      .is("deletedAt", null);
      
    if (bootcamps) {
      bootcamps.forEach((b: any) => {
        routes.push({
          url: `${baseUrl}/bootcamp/${b.slug}`,
          lastModified: new Date(b.updated_at || new Date()),
          priority: 0.8,
        });
      });
    }
  } catch (e) {
    console.error("Sitemap: error fetching bootcamps", e);
  }

  return routes;
}
