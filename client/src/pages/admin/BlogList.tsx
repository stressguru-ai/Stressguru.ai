import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [guruFilter, setGuruFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: blogs, isLoading } = trpc.blog.list.useQuery({
    search: search || undefined,
    guruId: guruFilter !== "all" ? parseInt(guruFilter) : undefined,
    status: statusFilter !== "all" ? (statusFilter as "draft" | "published") : undefined,
  });

  const { data: gurus } = trpc.blog.listGurusAdmin.useQuery();

  const publishMutation = trpc.blog.publish.useMutation({
    onSuccess: () => {
      toast.success("Blog published successfully");
      utils.blog.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to publish: ${error.message}`);
    },
  });

  const unpublishMutation = trpc.blog.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Blog unpublished");
      utils.blog.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to unpublish: ${error.message}`);
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog deleted");
      utils.blog.list.invalidate();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
            <p className="text-slate-600 mt-1">
              Manage, edit, and publish your blog posts
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/blogs/new?mode=manual">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Manual
              </Button>
            </Link>
            <Link href="/admin/blogs/new?mode=ai">
              <Button className="bg-[#7BDDE5] hover:bg-[#6bcdd5] text-slate-900">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={guruFilter} onValueChange={setGuruFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Guru" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gurus</SelectItem>
              {gurus?.map((guru) => (
                <SelectItem key={guru.id} value={guru.id.toString()}>
                  {guru.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading blogs...</div>
          ) : blogs && blogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 truncate max-w-[300px]">
                            {blog.title}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-2">
                            {blog.createdBy === "ai" && (
                              <span className="inline-flex items-center gap-1 text-purple-600">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            )}
                            {blog.readTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {blog.authorImage && (
                          <img
                            src={blog.authorImage}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm">{blog.authorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{blog.category}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/blogs/${blog.id}`}>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          {blog.status === "draft" ? (
                            <DropdownMenuItem
                              onClick={() => publishMutation.mutate({ id: blog.id })}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => unpublishMutation.mutate({ id: blog.id })}
                            >
                              <EyeOff className="w-4 h-4 mr-2" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(blog.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <div className="text-slate-500 mb-4">No blogs found</div>
              <Link href="/admin/blogs/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Blog
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
