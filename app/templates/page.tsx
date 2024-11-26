import { TemplateCard } from "@/components/templates/template-card";
import { resumeTemplates } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:from-gray-900 dark:to-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter dark:text-blue-100">Resume Templates</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose a template to start creating your professional resume
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(resumeTemplates).map(([id, template]) => (
            <TemplateCard key={id} id={id} template={template} />
          ))}
        </div>
      </div>
    </main>
  );
}