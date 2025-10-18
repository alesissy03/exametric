import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Award, Users, MessageSquare } from "lucide-react";

interface StudentScore {
  id: string;
  studentName: string;
  assessmentType: "Oral" | "Written";
  score: number;
}

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

const Insights = () => {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);

  useEffect(() => {
    const savedScores = localStorage.getItem("student_scores");
    const savedOpinions = localStorage.getItem("opinions");
    
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedOpinions) setOpinions(JSON.parse(savedOpinions));
  }, []);

  const calculateStats = () => {
    const oralScores = scores.filter(s => s.assessmentType === "Oral");
    const writtenScores = scores.filter(s => s.assessmentType === "Written");
    
    const oralAvg = oralScores.length > 0 
      ? oralScores.reduce((acc, s) => acc + s.score, 0) / oralScores.length 
      : 0;
    const writtenAvg = writtenScores.length > 0 
      ? writtenScores.reduce((acc, s) => acc + s.score, 0) / writtenScores.length 
      : 0;

    const preferenceCounts = opinions.reduce((acc, op) => {
      acc[op.preferredType] = (acc[op.preferredType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalOpinions = opinions.length || 1;

    return {
      oralAvg: Number(oralAvg.toFixed(2)),
      writtenAvg: Number(writtenAvg.toFixed(2)),
      preferencePercents: {
        Oral: ((preferenceCounts.Oral || 0) / totalOpinions * 100).toFixed(1),
        Written: ((preferenceCounts.Written || 0) / totalOpinions * 100).toFixed(1),
        Both: ((preferenceCounts.Both || 0) / totalOpinions * 100).toFixed(1),
      }
    };
  };

  const stats = calculateStats();

  const chartData = [
    { name: "Oral", average: stats.oralAvg },
    { name: "Written", average: stats.writtenAvg },
  ];

  const pieData = Object.entries(stats.preferencePercents).map(([name, value]) => ({
    name,
    value: parseFloat(value)
  })).filter(d => d.value > 0);

  const getSummary = () => {
    if (scores.length === 0 && opinions.length === 0) {
      return "Add some data to see insights!";
    }

    const betterPerformance = stats.oralAvg > stats.writtenAvg ? "oral" : "written";
    const mostPreferred = Object.entries(stats.preferencePercents)
      .reduce((a, b) => parseFloat(a[1]) > parseFloat(b[1]) ? a : b)[0].toLowerCase();

    return `Students tend to perform better in ${betterPerformance} assessments but prefer ${mostPreferred} assessments.`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Research Insights</h1>
          <p className="text-muted-foreground text-lg">Comprehensive analysis of assessment performance and student preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Oral Average</CardTitle>
              <Award className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.oralAvg}</div>
              <p className="text-sm text-muted-foreground mt-2">Out of 100</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Written Average</CardTitle>
              <Award className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{stats.writtenAvg}</div>
              <p className="text-sm text-muted-foreground mt-2">Out of 100</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{scores.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Recorded scores</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Student Opinions</CardTitle>
              <MessageSquare className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{opinions.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Responses collected</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 shadow-elevated border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Key Finding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium leading-relaxed">{getSummary()}</p>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Performance Comparison</CardTitle>
              <CardDescription className="text-base">Average scores by assessment type</CardDescription>
            </CardHeader>
            <CardContent>
              {scores.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }} 
                    />
                    <Bar dataKey="average" fill="hsl(var(--primary))" name="Average Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No performance data available yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Student Preferences</CardTitle>
              <CardDescription className="text-base">Distribution of preferred assessment types</CardDescription>
            </CardHeader>
            <CardContent>
              {opinions.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No opinion data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
