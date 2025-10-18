import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface StudentScore {
  id: string;
  studentName: string;
  assessmentType: "Oral" | "Written";
  score: number;
}

const Analyze = () => {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [studentName, setStudentName] = useState("");
  const [assessmentType, setAssessmentType] = useState<"Oral" | "Written">("Oral");
  const [score, setScore] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !score) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newScore: StudentScore = {
      id: Date.now().toString(),
      studentName,
      assessmentType,
      score: Number(score),
    };

    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem("student_scores", JSON.stringify(updatedScores));

    toast({
      title: "Score added",
      description: `Added score for ${studentName}`,
    });

    setStudentName("");
    setScore("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        const newScores: StudentScore[] = [];

        dataLines.forEach((line, index) => {
          const [name, type, scoreValue] = line.split(',').map(s => s.trim());
          
          if (name && type && scoreValue) {
            const assessmentType = type.toLowerCase() === 'oral' ? 'Oral' : 'Written';
            const parsedScore = Number(scoreValue);
            
            if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100) {
              newScores.push({
                id: `${Date.now()}-${index}`,
                studentName: name,
                assessmentType,
                score: parsedScore,
              });
            }
          }
        });

        if (newScores.length > 0) {
          const updatedScores = [...scores, ...newScores];
          setScores(updatedScores);
          localStorage.setItem("student_scores", JSON.stringify(updatedScores));
          
          toast({
            title: "Upload successful",
            description: `Added ${newScores.length} student scores`,
          });
        } else {
          toast({
            title: "No valid data",
            description: "CSV file contains no valid records",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Error parsing CSV file",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const chartData = () => {
    const oralScores = scores.filter(s => s.assessmentType === "Oral");
    const writtenScores = scores.filter(s => s.assessmentType === "Written");
    
    const oralAvg = oralScores.length > 0 
      ? oralScores.reduce((acc, s) => acc + s.score, 0) / oralScores.length 
      : 0;
    const writtenAvg = writtenScores.length > 0 
      ? writtenScores.reduce((acc, s) => acc + s.score, 0) / writtenScores.length 
      : 0;

    return [
      { name: "Oral", average: Number(oralAvg.toFixed(2)) },
      { name: "Written", average: Number(writtenAvg.toFixed(2)) },
    ];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Analyze Performance Data</h1>
          <p className="text-muted-foreground text-lg">Enter student assessment scores and view comparative analytics</p>
        </div>

        <Card className="shadow-card hover:shadow-elevated transition-shadow mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Student Data
            </CardTitle>
            <CardDescription className="text-base">
              Upload a CSV file with columns: Student Name, Assessment Type, Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-medium text-lg">Click to upload CSV file</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      CSV format: Student Name, Assessment Type (Oral/Written), Score (0-100)
                    </p>
                  </div>
                </Label>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Example CSV format:</p>
                <code className="text-xs bg-background/50 p-2 rounded block">
                  Student Name,Assessment Type,Score<br />
                  John Doe,Oral,85<br />
                  Jane Smith,Written,92
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Add Student Score</CardTitle>
              <CardDescription className="text-base">Manually record a new assessment result</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentType">Assessment Type</Label>
                  <Select value={assessmentType} onValueChange={(value: "Oral" | "Written") => setAssessmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Written">Written</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score">Score (0-100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </div>

                <Button type="submit" className="w-full">Add Score</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Average Scores Comparison</CardTitle>
              <CardDescription className="text-base">Visual comparison of assessment performance</CardDescription>
            </CardHeader>
            <CardContent>
              {scores.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData()}>
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
                    <Legend />
                    <Bar dataKey="average" fill="hsl(var(--primary))" name="Average Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Add some scores to see the comparison chart
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {scores.length > 0 && (
          <Card className="mt-8 shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">All Recorded Scores</CardTitle>
              <CardDescription className="text-base">{scores.length} assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Assessment Type</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.studentName}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.assessmentType === "Oral" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-secondary/10 text-secondary"
                        }`}>
                          {s.assessmentType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{s.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Analyze;
