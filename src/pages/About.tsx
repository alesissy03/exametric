import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Examertric</h1>
            <p className="text-muted-foreground text-xl">Understanding Assessment Methods Through Data</p>
          </div>

          <Card className="mb-10 shadow-elevated border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Project Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="leading-relaxed text-lg">
                Examertric is an educational research platform designed to help students, teachers, and researchers 
                explore how students perform and feel about different assessment methods—specifically comparing 
                <strong className="text-primary font-semibold"> oral assessments</strong> versus <strong className="text-accent font-semibold"> written assessments</strong>.
              </p>
              <p className="leading-relaxed text-lg">
                By collecting real performance data and student opinions, we can better understand the strengths 
                and preferences associated with each assessment type, ultimately informing more effective 
                evaluation strategies in education.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2 mb-10">
            <Card className="shadow-card hover:shadow-elevated transition-shadow border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  Share your experiences and preferences. Your input helps educators understand how different 
                  assessment methods affect learning and performance.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-shadow border-t-4 border-t-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  For Educators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  Gather data-driven insights about assessment effectiveness. Use the findings to make informed 
                  decisions about evaluation methods in your curriculum.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card hover:shadow-elevated transition-shadow mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                Research Inspiration
              </CardTitle>
              <CardDescription className="text-base">Based on peer-reviewed educational research</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="leading-relaxed text-lg">
                This platform is inspired by the seminal study <em>"Oral vs Written Assessments: A Test of 
                Students' Performance and Attitudes"</em> which investigates the comparative effectiveness 
                of different assessment modalities in educational settings.
              </p>
              <Button variant="outline" size="lg" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
                <a 
                  href="https://www.tandfonline.com/doi/full/10.1080/02602938.2010.515012" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read the Research Paper
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed"><strong className="font-semibold">Performance Tracking:</strong> Record and analyze student scores across both assessment types</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed"><strong className="font-semibold">Opinion Collection:</strong> Gather student preferences and reasoning</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed"><strong className="font-semibold">Data Visualization:</strong> Interactive charts for easy interpretation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed"><strong className="font-semibold">Insights Dashboard:</strong> Automated analysis and key findings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
