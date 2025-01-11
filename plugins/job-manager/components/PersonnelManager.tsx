import { useState } from "react";
import { useJobManagerStore } from "../store/jobManagerStore";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const PersonnelManager = () => {
    const { personnel, addPersonnel, removePersonnel } = useJobManagerStore();
    const [isAddingPersonnel, setIsAddingPersonnel] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: '', groups: [], jobs: [] });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addPersonnel(formData);
      setFormData({ name: '', email: '', role: '', groups: [], jobs: [] });
      setIsAddingPersonnel(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Personel Yönetimi</CardTitle>
          <Button onClick={() => setIsAddingPersonnel(true)}>
            <Plus className="mr-2 h-4 w-4" /> Personel Ekle
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {personnel.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-2">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.email}</p>
                </div>
                <Button variant="destructive" onClick={() => removePersonnel(person.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        
        <Dialog open={isAddingPersonnel} onOpenChange={setIsAddingPersonnel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Personel Ekle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">İsim</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={formData.role} onChange={handleInputChange} />
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
  };