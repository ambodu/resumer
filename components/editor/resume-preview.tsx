"use client";

import { ResumeData } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import dom2canvs from 'dom2canvas'
import { useRef } from "react";
import jsPDF from 'jspdf'
interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  let canvas: HTMLCanvasElement;  
  const render_el = useRef(null) as any
  const styles = `
    <style>
      .p-8 {
        padding: 2rem;
      }
      
      .gap-2 {
        gap: 0.5rem;
      }

      .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }

      .text-gray-600 {
        --tw-text-opacity: 1;
        color: rgb(75 85 99 / var(--tw-text-opacity, 1));
      }

      .font-bold {
        font-weight: 700;
      }

      .text-center {
        text-align: center;
      }

      .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }

      .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 0;
        margin-right: calc(1rem * var(--tw-space-x-reverse));
        margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
      }

      . border-b dark:border-gray-300 {
         border-b dark:border-gray-300ottom: 1px solid #000;
      }

      .flex {
        display: flex;
      }

      .justify-between {
        justify-content: space-between;
      }
      .text-gray-700 {
          --tw-text-opacity: 1;
          color: rgb(55 65 81 / var(--tw-text-opacity, 1));
      }
      .space-y-2 {
        margin-top: 0.25rem;
      }

      .py-1 {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }

      h3 {
        margin: 0px;
      }

      p {
        margin: 0px;
      }

        .items-start {
        align-items: flex-start;
      }

      .px-3 {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }

      .max-w-[800px] {
        margin: 0 auto;
      }

      .bg-white {
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
      }

      .bg-gray-100 {
        --tw-bg-opacity: 1;
        background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
      }

      .flex-wrap {
        flex-wrap: wrap;
      }
    </style>
  `

  const downloadPDF = async () => {
    await dom2canvs(render_el.current, styles, {
      width: render_el.current.offsetWidth,
      height: render_el.current.scrollHeight
    }).then((_canvas)=>{
      canvas = _canvas
      console.log(render_el.current,canvas, 'canvas');
      
    })

    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0,0,0);
    pdf.save("downloadedPdf.pdf");
  };

  const downloadImage = async () => {
    await dom2canvs(render_el.current, styles, {
      width: render_el.current.offsetWidth,
      height: render_el.current.scrollHeight
    }).then((_canvas)=>{
      canvas = _canvas
    })

    const link = document.createElement("a");
    
    // change the type of the image you want to download!
    link.setAttribute("href", canvas.toDataURL("image/png"));
    link.setAttribute("download", "index.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)

  }

  return (
    <div className="p-6 space-y-6 dark:text-white ">
      <div className="flex sticky top-0 z-10 bg-gray-50 dark:bg-black p-4 gap-8 justify-between align-middle">
        <h1 className="text-4xl flex align-middle">Preview</h1>
        <div className="btn-container flex gap-5 flex-wrap justify-end">
          <Button onClick={downloadPDF} className="">
            <Download className="mr-2 h-4" />
            Download PDF
          </Button>
          <Button onClick={downloadImage} className="">
            <Download className="mr-2 h-4" />
            Download Image
          </Button>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto space-y-8 bg-white dark:bg-black p-8 shadow-lg rounded-lg" ref={render_el}>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
          <div className="text-gray-600 dark:text-gray-400 space-x-4">
            {resumeData.personalInfo.email && (
              <span>{resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold  border-b dark:border-gray-300 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{resumeData.personalInfo.summary}</p>
          </div>
        )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold  border-b dark:border-gray-300 pb-2">
              Work Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {exp.startDate &&
                      format(new Date(exp.startDate), "MMM yyyy")}
                    {exp.endDate && " - "}
                    {exp.endDate && format(new Date(exp.endDate), "MMM yyyy")}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>

        
          <div className="space-y-4">
            <h2 className="text-xl font-semibold  border-b dark:border-gray-300 pb-2">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.graduationDate &&
                      format(new Date(edu.graduationDate), "MMM yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        

        
          <div className="space-y-2">
            <h2 className="text-xl font-semibold  border-b dark:border-gray-300 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        
      </div>
    </div>
  );
}