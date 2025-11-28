import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, User } from "lucide-react";

export default function ForumThreadPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<any>(null);
  const [replyBody, setReplyBody] = useState("");

  const fetchThread = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${threadId}`, {
       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setThread(res.data));
  };

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  const handlePostReply = async () => {
    if (!replyBody.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${threadId}/posts`,
        { body: replyBody },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReplyBody("");
      fetchThread(); // Refresh posts
    } catch (error) {
      console.error("Failed to post reply");
    }
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/learn/forum')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
      </Button>

      {/* Main Thread Post */}
      <Card className="border-cosmic-glow/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row gap-4 items-start pb-2">
          <div>
            <h1 className="text-2xl font-bold">{thread.title}</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{thread.author?.name || "Unknown"}</span>
              <span>•</span>
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="whitespace-pre-wrap leading-relaxed">{thread.body}</p>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4 pl-0 md:pl-8">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> {thread.posts?.length || 0} Replies
        </h3>
        
        {thread.posts?.map((post: any) => (
          <Card key={post.id} className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{post.author?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{post.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Input */}
      <div className="pt-6 border-t">
        <h3 className="mb-4 font-semibold">Post a Reply</h3>
        <Textarea 
          placeholder="Type your response here..." 
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button onClick={handlePostReply} disabled={!replyBody.trim()}>
          Post Reply
        </Button>
      </div>
    </div>
  );
}