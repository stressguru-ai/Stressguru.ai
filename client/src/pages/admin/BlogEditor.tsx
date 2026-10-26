import AdminLayout from "@/components/AdminLayout";
import BlogPreview from "@/components/admin/BlogPreview";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Plus,
  Wand2,
  Send,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function BlogEditor() {
  const params = useParams<{ id?: string }>();
  const searchParams = new URLSearchParams(window.location.search);
  const initialMode = searchParams.get("mode") || "manual";
  const blogId = params.id ? parseInt(params.id) : undefined;
  const isEditing = !!blogId;

  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [guruId, setGuruId] = useState<number | null>(null);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // AI wizard state
  const [aiMode, setAiMode] = useState(initialMode === "ai");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  
  // AI Wizard generated content preview state
  const [aiGeneratedContent, setAiGeneratedContent] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    metaTitle: string;
    metaDescription: string;
  } | null>(null);
  const [showAiPreview, setShowAiPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const { data: gurus } = trpc.blog.listGurusAdmin.useQuery();
  const { data: existingBlog, isLoading: blogLoading } = trpc.blog.getById.useQuery(
    { id: blogId! },
    { enabled: !!blogId }
  );
  const { data: guruProblems } = trpc.blog.getGuruProblems.useQuery(
    { guruId: guruId! },
    { enabled: !!guruId && aiMode }
  );

  // Mutations
  const createMutation = trpc.blog.create.useMutation({
    onSuccess: (data) => {
      toast.success("Blog created successfully");
      setLocation(`/admin/blogs/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create blog: ${error.message}`);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog updated successfully");
      utils.blog.getById.invalidate({ id: blogId! });
    },
    onError: (error) => {
      toast.error(`Failed to update blog: ${error.message}`);
    },
  });

  const publishMutation = trpc.blog.publish.useMutation({
    onSuccess: () => {
      toast.success("Blog published!");
      utils.blog.getById.invalidate({ id: blogId! });
    },
    onError: (error) => {
      toast.error(`Failed to publish: ${error.message}`);
    },
  });

  const generateBlogMutation = trpc.blog.generateBlog.useMutation({
    onSuccess: (data) => {
      toast.success("Blog generated successfully!");
      // Redirect to the edit page for the generated blog
      setLocation(`/admin/blogs/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to generate blog: ${error.message}`);
      setIsGenerating(false);
    },
  });

  const generateImageMutation = trpc.blog.generateHeroImage.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        setImage(data.url);
        toast.success("Hero image generated!");
      }
      setIsGeneratingImage(false);
    },
    onError: (error) => {
      toast.error(`Failed to generate image: ${error.message}`);
      setIsGeneratingImage(false);
    },
  });

  const uploadImageMutation = trpc.blog.uploadHeroImage.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        setImage(data.url);
        toast.success("Image uploaded!");
      }
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload image: ${error.message}`);
      setIsUploading(false);
    },
  });

  const regenerateMutation = trpc.blog.regenerateBlog.useMutation({
    onSuccess: (data) => {
      toast.success("Blog content regenerated successfully!");
      setIsRegenerating(false);
      setShowRegenerateConfirm(false);
      // Refresh the blog data
      utils.blog.getById.invalidate({ id: blogId! });
    },
    onError: (error) => {
      toast.error(`Failed to regenerate: ${error.message}`);
      setIsRegenerating(false);
    },
  });

  const handleRegenerate = () => {
    if (!blogId) return;
    setIsRegenerating(true);
    regenerateMutation.mutate({ id: blogId });
  };

  const suggestKeywordsMutation = trpc.blog.suggestKeywords.useMutation({
    onSuccess: (data) => {
      if (data.keywords && data.keywords.length > 0) {
        // Add suggested keywords that aren't already in the list
        const newKeywords = data.keywords.filter(k => !seoKeywords.includes(k));
        if (newKeywords.length > 0) {
          setSeoKeywords([...seoKeywords, ...newKeywords]);
          toast.success(`Added ${newKeywords.length} suggested keywords`);
        } else {
          toast.info("All suggested keywords are already added");
        }
      }
      setIsGeneratingKeywords(false);
    },
    onError: (error) => {
      toast.error(`Failed to suggest keywords: ${error.message}`);
      setIsGeneratingKeywords(false);
    },
  });

  // Reset form when switching between edit and create modes
  useEffect(() => {
    if (!blogId) {
      // Reset all form fields when creating a new blog
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setCategory("");
      setGuruId(null);
      setSeoKeywords([]);
      setNewKeyword("");
      setMetaTitle("");
      setMetaDescription("");
      setAiMode(initialMode === "ai");
      setSelectedProblem("");
      setAdditionalContext("");
      setAiGeneratedContent(null);
      setShowAiPreview(false);
    }
  }, [blogId, initialMode]);

  // Load existing blog data
  useEffect(() => {
    if (existingBlog && blogId) {
      setTitle(existingBlog.title);
      setExcerpt(existingBlog.excerpt);
      setContent(existingBlog.content);
      setImage(existingBlog.image || "");
      setCategory(existingBlog.category || "");
      setGuruId(existingBlog.guruId);
      // Parse seoKeywords - handle both array and JSON string formats
      const keywords = existingBlog.seoKeywords;
      if (Array.isArray(keywords)) {
        setSeoKeywords(keywords);
      } else if (typeof keywords === 'string') {
        try {
          const parsed = JSON.parse(keywords);
          setSeoKeywords(Array.isArray(parsed) ? parsed : []);
        } catch {
          setSeoKeywords([]);
        }
      } else {
        setSeoKeywords([]);
      }
      setMetaTitle(existingBlog.metaTitle || "");
      setMetaDescription(existingBlog.metaDescription || "");
    }
  }, [existingBlog, blogId]);

  const handleSave = (asDraft = true) => {
    if (!title || !excerpt || !content || !guruId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      updateMutation.mutate({
        id: blogId!,
        title,
        excerpt,
        content,
        image: image || undefined,
        category: category || undefined,
        guruId,
        seoKeywords,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      });
    } else {
      createMutation.mutate({
        title,
        excerpt,
        content,
        image: image || undefined,
        category: category || undefined,
        guruId,
        seoKeywords,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      });
    }
  };

  const handleGenerateBlog = () => {
    if (!guruId || !selectedProblem) {
      toast.error("Please select a guru and problem");
      return;
    }

    setIsGenerating(true);
    generateBlogMutation.mutate({
      guruId,
      problem: selectedProblem,
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : undefined,
      additionalContext: additionalContext || undefined,
    });
  };

  const handleGenerateImage = () => {
    if (!title && !selectedProblem) {
      toast.error("Please enter a title or select a problem first");
      return;
    }

    setIsGeneratingImage(true);
    generateImageMutation.mutate({
      blogId: blogId,
      title: title || selectedProblem,
      category: category || undefined,
    });
  };

  const handleSuggestKeywords = () => {
    const textForKeywords = title || selectedProblem || content;
    if (!textForKeywords) {
      toast.error("Please enter a title, select a problem, or add content first");
      return;
    }

    setIsGeneratingKeywords(true);
    suggestKeywordsMutation.mutate({
      title: title || selectedProblem,
      content: content || undefined,
      category: category || undefined,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadImageMutation.mutate({
        blogId: blogId,
        base64,
        mimeType: file.type,
        filename: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const addKeyword = () => {
    if (newKeyword && !seoKeywords.includes(newKeyword)) {
      setSeoKeywords([...seoKeywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoKeywords(seoKeywords.filter((k) => k !== keyword));
  };

  if (blogLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Blog" : "Create New Blog"}
              </h1>
              {existingBlog && (
                <span
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    existingBlog.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {existingBlog.status}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Preview Button */}
            {(isEditing || title || content) && (
              <BlogPreview
                blog={{
                  title: title || "Untitled Blog Post",
                  excerpt: excerpt || "",
                  content: content || "",
                  image: image || null,
                  category: category || null,
                  authorName: gurus?.find(g => g.id === guruId)?.name || null,
                  authorRole: gurus?.find(g => g.id === guruId)?.role || null,
                  authorImage: gurus?.find(g => g.id === guruId)?.image || null,
                  createdAt: existingBlog?.createdAt || new Date(),
                  publishedAt: existingBlog?.publishedAt || null,
                }}
                trigger={
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                }
              />
            )}
            {isEditing && (
              <>
                {showRegenerateConfirm ? (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                    <span className="text-sm text-amber-800">Regenerate content?</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="h-7 px-3 text-xs"
                    >
                      {isRegenerating ? (
                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Regenerating...</>
                      ) : (
                        "Yes, Regenerate"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowRegenerateConfirm(false)}
                      disabled={isRegenerating}
                      className="h-7 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowRegenerateConfirm(true)}
                    className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Content
                  </Button>
                )}
              </>
            )}
            {isEditing && existingBlog?.status === "draft" && (
              <Button
                onClick={() => publishMutation.mutate({ id: blogId! })}
                disabled={publishMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Publish
              </Button>
            )}
            {(isEditing || (!aiMode)) && (
              <Button
                onClick={() => handleSave()}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Mode Tabs - Only show for new blogs */}
        {!isEditing && (
          <Tabs value={aiMode ? "ai" : "manual"} onValueChange={(v) => setAiMode(v === "ai")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="manual">
                <ImageIcon className="w-4 h-4 mr-2" />
                Manual Editor
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Wizard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* AI Wizard Mode */}
        {aiMode && !isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Guru & Problem Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Select a Guru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={guruId?.toString() || ""}
                    onValueChange={(v) => {
                      setGuruId(parseInt(v));
                      setSelectedProblem("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Guru..." />
                    </SelectTrigger>
                    <SelectContent>
                      {gurus?.map((guru) => (
                        <SelectItem key={guru.id} value={guru.id.toString()}>
                          <div className="flex items-center gap-2">
                            <img
                              src={guru.image}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            {guru.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {guruId && guruProblems && (
                    <>
                      <div className="pt-4">
                        <Label className="text-base font-semibold">Step 2: Select an ICP Problem</Label>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {guruProblems.problems.map((problem, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedProblem(problem)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedProblem === problem
                                ? "border-[#7BDDE5] bg-[#7BDDE5]/10"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-sm">{problem}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Additional Context */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Additional Context (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any specific points you want the AI to cover..."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Generate */}
            <div className="space-y-6">
              {/* Hero Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hero Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Hero"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImage("")}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-1" />
                      )}
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || (!selectedProblem && !title)}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-1" />
                      )}
                      AI Gen
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* SEO Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SEO Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addKeyword}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleSuggestKeywords}
                    disabled={isGeneratingKeywords || (!selectedProblem && !title)}
                  >
                    {isGeneratingKeywords ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    AI Suggest Keywords
                  </Button>

                  {seoKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {seoKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-sm"
                        >
                          {kw}
                          <button onClick={() => removeKeyword(kw)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateBlog}
                disabled={!guruId || !selectedProblem || isGenerating}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-[#7BDDE5] hover:from-purple-600 hover:to-[#6bcdd5] text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Blog...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Blog with AI
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                The AI will generate a complete blog post as a draft. You can then edit and publish it.
              </p>
            </div>
          </div>
        ) : (
          /* Manual Editor Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="A brief summary of the blog..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <div className="mt-2">
                      <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your blog post..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Hero Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hero Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Hero"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImage("")}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-1" />
                      )}
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !title}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-1" />
                      )}
                      AI Gen
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Author (Guru) *</Label>
                    <Select
                      value={guruId?.toString() || ""}
                      onValueChange={(v) => setGuruId(parseInt(v))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Guru..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gurus?.map((guru) => (
                          <SelectItem key={guru.id} value={guru.id.toString()}>
                            {guru.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="e.g., Stress Management"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>SEO Keywords</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add keyword..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addKeyword())
                        }
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={handleSuggestKeywords}
                      disabled={isGeneratingKeywords || !title}
                    >
                      {isGeneratingKeywords ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4 mr-2" />
                      )}
                      AI Suggest Keywords
                    </Button>
                    
                    {seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {seoKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs"
                          >
                            {kw}
                            <button onClick={() => removeKeyword(kw)}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Meta Title (30-60 chars)</Label>
                    <Input
                      placeholder="SEO-optimized title for search engines..."
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      maxLength={60}
                      className="mt-2"
                    />
                    <p className={`text-xs mt-1 ${metaTitle.length < 30 || metaTitle.length > 60 ? 'text-red-500' : 'text-green-600'}`}>
                      {metaTitle.length}/60 characters {metaTitle.length < 30 && '(min 30)'}
                    </p>
                  </div>

                  <div>
                    <Label>Meta Description (50-160 chars)</Label>
                    <Textarea
                      placeholder="Compelling description for search results..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      maxLength={160}
                      rows={3}
                      className="mt-2"
                    />
                    <p className={`text-xs mt-1 ${metaDescription.length < 50 || metaDescription.length > 160 ? 'text-red-500' : 'text-green-600'}`}>
                      {metaDescription.length}/160 characters {metaDescription.length < 50 && '(min 50)'}
                    </p>
                  </div>

                  {!metaTitle && title && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Auto-generate meta title from blog title
                        const autoTitle = title.length > 50 ? title.substring(0, 47) + '...' : title + ' | StressGuru';
                        setMetaTitle(autoTitle.substring(0, 60));
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Auto-generate from Title
                    </Button>
                  )}

                  {!metaDescription && excerpt && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Auto-generate meta description from excerpt
                        const autoDesc = excerpt.length > 157 ? excerpt.substring(0, 157) + '...' : excerpt;
                        setMetaDescription(autoDesc.substring(0, 160));
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Auto-generate from Excerpt
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
