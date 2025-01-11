import { useState } from "react";
import { useJobManagerStore } from "../store/jobManagerStore";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const JobManager = () => {
  const { jobs, addJob, removeJob } = useJobManagerStore();
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Yardımcı fonksiyonlar
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in-progress': return 'Devam Ediyor';
      default: return 'Beklemede';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      default: return 'Düşük';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="İş ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Duruma göre filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="in-progress">Devam Ediyor</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsAddingJob(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni İş
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => removeJob(job.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(job.status)}>{getStatusLabel(job.status)}</Badge>
                <Badge variant={getPriorityVariant(job.priority)}>{getPriorityLabel(job.priority)}</Badge>
              </div>
              
              {job.dueDate && (
                <p className="text-sm text-muted-foreground mt-4">
                  Bitiş: {new Date(job.dueDate).toLocaleDateString('tr-TR')}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog bileşeni buraya gelecek... */}
    </div>
  );
};
