import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonnelManager } from "./PersonnelManager";
import { JobManager } from "./JobManager";
import { GroupManager } from "./GroupManager";
import { useEffect } from "react";
import { usePlugin } from "@core/hooks/usePlugin";
import { JobManagerPlugin } from "..";
import { BriefcaseIcon, UserIcon, UsersIcon } from "lucide-react";


export const JobManagerDashboard = () => {
  const { plugin, isActive, enable } = usePlugin(JobManagerPlugin.id);
  const defaultView = plugin?.settings?.defaultView || 'personnel';

  useEffect(() => {
    if (!isActive) {
      enable();
    }
  }, [isActive, enable]);

  if (!plugin || !isActive) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">İş Yönetimi</h1>
      </div>
      
      <Tabs defaultValue={defaultView} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personnel">
            <span className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Personel
            </span>
          </TabsTrigger>
          <TabsTrigger value="groups">
            <span className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Gruplar
            </span>
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <span className="flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4" />
              İşler
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-4">
          <PersonnelManager />
        </TabsContent>
        <TabsContent value="groups" className="space-y-4">
          <GroupManager />
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4">
          <JobManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};