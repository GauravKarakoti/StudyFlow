import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Plus } from "lucide-react";
import axios from "axios";

export default function ForumPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", body: "" });

  const fetchThreads = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads`, {
       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setThreads(res.data));
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleCreateThread = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads`, newThread, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsCreateOpen(false);
      setNewThread({ title: "", body: "" });
      fetchThreads();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cosmic-glow hover:bg-cosmic-mid text-white">
              <Plus className="w-4 h-4 mr-2" /> New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input 
                placeholder="Topic Title" 
                value={newThread.title}
                onChange={(e) => setNewThread({...newThread, title: e.target.value})}
              />
              <Textarea 
                placeholder="What's on your mind?" 
                className="min-h-[150px]"
                value={newThread.body}
                onChange={(e) => setNewThread({...newThread, body: e.target.value})}
              />
              <Button onClick={handleCreateThread} className="w-full">Post Discussion</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {threads.map((thread) => (
          <Link key={thread.id} to={`/learn/forum/${thread.id}`}>
            <Card className="hover:border-cosmic-glow/50 transition-colors cursor-pointer hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{thread.title}</CardTitle>
                <div className="text-xs text-muted-foreground">
                  {new Date(thread.updatedAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{thread.body}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-cosmic-glow">
                  <MessageCircle className="w-4 h-4" />
                  <span>{thread.posts?.length || 0} replies</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}