import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Layout, PenLine } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl dark:text-zinc-100">
            Create Your Professional Resume
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose from professionally designed templates and customize your resume with our easy-to-use editor. Stand out from the crowd and land your dream job.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/templates">
                <Layout className="mr-2 h-5 w-5" />
                Browse Templates
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link href="/editor">
                <PenLine className="mr-2 h-5 w-5" />
                Start from Scratch
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <section className="py-16 px-6 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-zinc-100">Why Choose Our Resume Builder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold dark:text-zinc-100">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose from our collection of professionally designed templates</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <PenLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold dark:text-zinc-100">Easy to Customize</h3>
              <p className="text-gray-600 dark:text-gray-400">Intuitive editor with real-time preview of your changes</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold dark:text-zinc-100">Export to PDF</h3>
              <p className="text-gray-600 dark:text-gray-400">Download your resume in PDF format, ready to send</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}