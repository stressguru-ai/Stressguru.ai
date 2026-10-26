import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, PenTool } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: blogs, isLoading: blogsLoading } = trpc.blog.list.useQuery({});
  const { data: gurus, isLoading: gurusLoading } = trpc.blog.listGurusAdmin.useQuery();

  const publishedCount = blogs?.filter((b) => b.status === "published").length || 0;
  const draftCount = blogs?.filter((b) => b.status === "draft").length || 0;
  const aiGeneratedCount = blogs?.filter((b) => b.createdBy === "ai").length || 0;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome to the StressGuru Admin Panel
            </p>
          </div>
          <Link href="/admin/blogs/new">
            <Button className="bg-[#7BDDE5] hover:bg-[#6bcdd5] text-slate-900">
              <PenTool className="w-4 h-4 mr-2" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Blogs
              </CardTitle>
              <FileText className="w-5 h-5 text-[#7BDDE5]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {blogsLoading ? "..." : blogs?.length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {publishedCount} published, {draftCount} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Published
              </CardTitle>
              <Eye className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {blogsLoading ? "..." : publishedCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Live on the website</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                AI Generated
              </CardTitle>
              <PenTool className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {blogsLoading ? "..." : aiGeneratedCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Created with AI wizard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active Gurus
              </CardTitle>
              <Users className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {gurusLoading ? "..." : gurus?.length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Available for content</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/blogs/new?mode=manual">
                <a className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-[#7BDDE5] hover:bg-[#7BDDE5]/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Write a Blog Manually
                    </div>
                    <div className="text-sm text-slate-500">
                      Use the rich text editor to create content
                    </div>
                  </div>
                </a>
              </Link>
              <Link href="/admin/blogs/new?mode=ai">
                <a className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-[#7BDDE5] hover:bg-[#7BDDE5]/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Generate with AI
                    </div>
                    <div className="text-sm text-slate-500">
                      Let AI create a blog based on ICP problems
                    </div>
                  </div>
                </a>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              {blogsLoading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : blogs && blogs.length > 0 ? (
                <div className="space-y-3">
                  {blogs.slice(0, 5).map((blog) => (
                    <Link key={blog.id} href={`/admin/blogs/${blog.id}`}>
                      <a className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">
                            {blog.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {blog.authorName} • {blog.category}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </a>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No blogs yet. Create your first one!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
