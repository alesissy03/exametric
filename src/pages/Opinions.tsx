import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface Opinion {
  id: string;
  preferredType: "Oral" | "Written" | "Both";
  reason: string;
  timestamp: string;
}

const COLORS = {
  Oral: "hsl(var(--primary))",
  Written: "hsl(var(--secondary))",
  Both: "hsl(var(--accent-foreground))",
};

const Opinions = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [preferredType, setPreferredType] = useState<"Oral" | "Written" | "Both">("Written");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a reason for your preference",
        variant: "destructive",
      });
      return;
    }

    const newOpinion: Opinion = {
      id: Date.now().toString(),
      preferredType,
      reason,
      timestamp: new Date().toLocaleString(),
    };

    const updatedOpinions = [...opinions, newOpinion];
    setOpinions(updatedOpinions);
    localStorage.setItem("opinions", JSON.stringify(updatedOpinions));

    toast({
      title: "Opinion recorded",
      description: "Thank you for sharing your perspective!",
    });

    setReason("");
  };

  const pieChartData = () => {
    const counts = opinions.reduce((acc, op) => {
      acc[op.preferredType] = (acc[op.preferredType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Student Opinions</h1>
          <p className="text-muted-foreground text-lg">Share your preferences and see what others think</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Share Your Opinion</CardTitle>
              <CardDescription className="text-base">Tell us which assessment type you prefer and why</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Which test type do you prefer?</Label>
                  <RadioGroup value={preferredType} onValueChange={(value: any) => setPreferredType(value)}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="Oral" id="oral" />
                      <Label htmlFor="oral" className="flex-1 cursor-pointer">Oral Assessment</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="Written" id="written" />
                      <Label htmlFor="written" className="flex-1 cursor-pointer">Written Assessment</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="Both" id="both" />
                      <Label htmlFor="both" className="flex-1 cursor-pointer">Both Equally</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you prefer this type?</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full">Submit Opinion</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Preference Distribution</CardTitle>
              <CardDescription className="text-base">What students prefer overall</CardDescription>
            </CardHeader>
            <CardContent>
              {opinions.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Submit an opinion to see the distribution
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {opinions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Recent Opinions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {opinions.slice().reverse().map((opinion) => (
                <Card key={opinion.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        opinion.preferredType === "Oral" 
                          ? "bg-primary/10 text-primary"
                          : opinion.preferredType === "Written"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-accent text-accent-foreground"
                      }`}>
                        Prefers {opinion.preferredType}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{opinion.timestamp}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{opinion.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Opinions;
