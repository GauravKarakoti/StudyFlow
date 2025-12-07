import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`, {
       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-cosmic-glow">Leaderboard</h1>
      <div className="space-y-4">
        {users.map((entry, i) => (
          <div key={entry.id} className="flex items-center p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="w-8 font-bold text-xl text-muted-foreground">{i + 1}</span>
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={entry.user.avatarUrl} />
              <AvatarFallback>{entry.user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="font-semibold">{entry.user.name}</div>
            </div>
            <div className="font-bold text-amber-400">{entry.points} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}