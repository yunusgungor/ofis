import { useState } from "react";
import { useJobManagerStore } from "../store/jobManagerStore";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const GroupManager = () => {
  const { groups, addGroup, removeGroup } = useJobManagerStore();
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', members: [], jobs: [] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup(formData);
    setFormData({ name: '', description: '', members: [], jobs: [] });
    setIsAddingGroup(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grup Yönetimi</CardTitle>
        <Button onClick={() => setIsAddingGroup(true)}>
          <Plus className="mr-2 h-4 w-4" /> Grup Ekle
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center justify-between p-2">
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <Button variant="destructive" onClick={() => removeGroup(group.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      
      <Dialog open={isAddingGroup} onOpenChange={setIsAddingGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Grup Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Grup Adı</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
