
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminSkillDefaults } from "@/config/site";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
};

const emptySkill = {
  name: "",
  category: "",
  level: 70,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(() => adminSkillDefaults.map((skill) => ({ ...skill })));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState(emptySkill);

  const resetForm = () => {
    setEditingSkill(null);
    setFormData(emptySkill);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    toast.success("Skill removed.");
  };

  const handleSubmit = () => {
    const name = formData.name.trim();
    const category = formData.category.trim();

    if (!name) {
      toast.error("Skill name is required.");
      return;
    }

    if (!category) {
      toast.error("Choose a category for the skill.");
      return;
    }

    const level = Math.min(100, Math.max(0, Number(formData.level) || 0));

    if (editingSkill) {
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === editingSkill.id
            ? { ...skill, name, category, level }
            : skill,
        ),
      );
      toast.success("Skill updated.");
    } else {
      const newSkill: Skill = {
        id: Date.now(),
        name,
        category,
        level,
      };
      setSkills((prev) => [newSkill, ...prev]);
      toast.success("Skill added.");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills matrix</h1>
          <p className="text-muted-foreground">
            Track the capabilities you showcase and keep proficiency scores current.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSkill ? "Edit skill" : "Add new skill"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Skill name</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Design systems strategy"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, category: event.target.value }))
                  }
                  placeholder="Design, Engineering, Leadership..."
                />
              </div>
              <div>
                <Label>Confidence level (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.level}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, level: Number(event.target.value) }))
                  }
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-gradient-primary">
                {editingSkill ? "Update skill" : "Add skill"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell className="w-64">
                    <div className="flex items-center gap-3">
                      <Progress value={skill.level} className="h-2 w-full" />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


