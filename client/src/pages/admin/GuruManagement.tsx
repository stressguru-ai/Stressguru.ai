import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function GuruManagement() {
  const utils = trpc.useUtils();
  const { data: gurus, isLoading } = trpc.blog.listGurusAdmin.useQuery();

  const [editingGuru, setEditingGuru] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    description: "",
    icpProblems: [] as string[],
  });
  const [newProblem, setNewProblem] = useState("");

  const updateMutation = trpc.blog.updateGuru.useMutation({
    onSuccess: () => {
      toast.success("Guru updated successfully");
      utils.blog.listGurusAdmin.invalidate();
      setEditingGuru(null);
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const openEditDialog = (guru: NonNullable<typeof gurus>[0]) => {
    setFormData({
      name: guru.name,
      role: guru.role,
      image: guru.image,
      description: guru.description || "",
      icpProblems: (guru.icpProblems as string[]) || [],
    });
    setEditingGuru(guru.id);
  };

  const handleSave = () => {
    if (!editingGuru) return;

    updateMutation.mutate({
      id: editingGuru,
      name: formData.name,
      role: formData.role,
      image: formData.image,
      description: formData.description,
      icpProblems: formData.icpProblems,
    });
  };

  const addProblem = () => {
    if (newProblem && !formData.icpProblems.includes(newProblem)) {
      setFormData({
        ...formData,
        icpProblems: [...formData.icpProblems, newProblem],
      });
      setNewProblem("");
    }
  };

  const removeProblem = (problem: string) => {
    setFormData({
      ...formData,
      icpProblems: formData.icpProblems.filter((p) => p !== problem),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Guru Management</h1>
          <p className="text-slate-600 mt-1">
            Manage your AI Gurus and their ICP problems for blog generation
          </p>
        </div>

        {/* Gurus Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gurus?.map((guru) => (
              <Card key={guru.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={guru.image}
                    alt={guru.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{guru.name}</h3>
                    <p className="text-sm text-white/80">{guru.role}</p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="text-sm text-slate-600 mb-3">
                    {(guru.icpProblems as string[])?.length || 0} ICP problems defined
                  </div>
                  <Dialog
                    open={editingGuru === guru.id}
                    onOpenChange={(open) => !open && setEditingGuru(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openEditDialog(guru)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Guru
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit {guru.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Input
                              value={formData.role}
                              onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value })
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Image URL</Label>
                          <Input
                            value={formData.image}
                            onChange={(e) =>
                              setFormData({ ...formData, image: e.target.value })
                            }
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>ICP Problems (for AI Blog Generation)</Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="Add a problem statement..."
                              value={newProblem}
                              onChange={(e) => setNewProblem(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && (e.preventDefault(), addProblem())
                              }
                            />
                            <Button type="button" variant="outline" onClick={addProblem}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 mt-3">
                            {formData.icpProblems.map((problem, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg"
                              >
                                <span className="flex-1 text-sm">{problem}</span>
                                <button
                                  onClick={() => removeProblem(problem)}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setEditingGuru(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="bg-[#7BDDE5] hover:bg-[#6bcdd5] text-slate-900"
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
