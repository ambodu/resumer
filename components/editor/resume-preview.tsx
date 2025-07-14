"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileImage, Eye, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { useResumeState } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function ResumePreview() {
  const { currentResume, isLoading } = useResumeState();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const render_el = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    const element = render_el.current;
    if (!element) {
      toast({
        title: "导出失败",
        description: "无法找到简历预览元素",
        variant: "destructive",
      });
      return;
    }

    if (!currentResume) {
      toast({
        title: "导出失败",
        description: "请先创建或选择一份简历",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // 检查html2canvas是否可用
      if (typeof html2canvas !== 'function') {
        throw new Error('PDF生成库未正确加载');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // 确保克隆的文档样式正确
          const clonedElement = clonedDoc.querySelector('[data-html2canvas-ignore]');
          if (clonedElement) {
            clonedElement.remove();
          }
        }
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('无法生成有效的画布');
      }

      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData === 'data:,') {
        throw new Error('无法生成图片数据');
      }

      // 检查jsPDF是否可用
      if (typeof jsPDF !== 'function') {
        throw new Error('PDF生成库未正确加载');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight <= 0 || !isFinite(imgHeight)) {
        throw new Error('计算的图片高度无效');
      }

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${currentResume?.personalInfo?.fullName?.trim() || 'resume'}.pdf`;
      
      // 验证文件名
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
      
      pdf.save(sanitizedFileName);
      
      toast({
        title: "PDF 导出成功",
        description: `简历已保存为 ${sanitizedFileName}`,
      });
    } catch (error) {
      console.error('PDF导出错误:', error);
      
      let errorMessage = "PDF 生成时出现未知错误";
      
      if (error instanceof Error) {
        if (error.message.includes('html2canvas')) {
          errorMessage = "页面渲染失败，请检查简历内容";
        } else if (error.message.includes('jsPDF')) {
          errorMessage = "PDF生成库加载失败，请刷新页面重试";
        } else if (error.message.includes('画布') || error.message.includes('图片')) {
          errorMessage = "简历内容转换失败，请检查是否包含无效内容";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "PDF导出失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadImage = async () => {
    const element = render_el.current;
    if (!element) {
      toast({
        title: "导出失败",
        description: "无法找到简历预览元素",
        variant: "destructive",
      });
      return;
    }

    if (!currentResume) {
      toast({
        title: "导出失败",
        description: "请先创建或选择一份简历",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // 检查html2canvas是否可用
      if (typeof html2canvas !== 'function') {
        throw new Error('图片生成库未正确加载');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('无法生成有效的画布');
      }

      const dataURL = canvas.toDataURL('image/png');
      if (!dataURL || dataURL === 'data:,') {
        throw new Error('无法生成图片数据');
      }

      const link = document.createElement('a');
      const fileName = `${currentResume?.personalInfo?.fullName?.trim() || 'resume'}.png`;
      
      // 验证文件名
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
      
      link.download = sanitizedFileName;
      link.href = dataURL;
      
      // 检查是否支持下载
      if (!link.download) {
        throw new Error('浏览器不支持文件下载');
      }
      
      link.click();
      
      toast({
        title: "图片导出成功",
        description: `简历已保存为 ${sanitizedFileName}`,
      });
    } catch (error) {
      console.error('图片导出错误:', error);
      
      let errorMessage = "图片生成时出现未知错误";
      
      if (error instanceof Error) {
        if (error.message.includes('html2canvas')) {
          errorMessage = "页面渲染失败，请检查简历内容";
        } else if (error.message.includes('画布') || error.message.includes('图片')) {
          errorMessage = "简历内容转换失败，请检查是否包含无效内容";
        } else if (error.message.includes('下载')) {
          errorMessage = "浏览器不支持文件下载，请尝试其他浏览器";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "图片导出失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先创建或选择一份简历</p>
      </div>
    );
  }

  const resumeData = currentResume

  return (
    <div className="p-6 space-y-6">
      <div className="flex sticky top-0 z-10 bg-gray-50 p-4 gap-8 justify-between align-middle">
        <h1 className="text-4xl flex align-middle">Preview</h1>
        <div className="btn-container flex gap-5 flex-wrap justify-end">
          <Button onClick={downloadPDF} disabled={isExporting} className="">
            {isExporting ? (
              <Loader2 className="mr-2 h-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4" />
            )}
            Download PDF
          </Button>
          <Button onClick={downloadImage} disabled={isExporting} className="">
            {isExporting ? (
              <Loader2 className="mr-2 h-4 animate-spin" />
            ) : (
              <FileImage className="mr-2 h-4" />
            )}
            Download Image
          </Button>
        </div>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              简历预览
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              A4 格式
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={render_el}
            className="max-w-[800px] mx-auto bg-white p-8 shadow-lg print:shadow-none min-h-[1123px]"
            style={{
              fontFamily: resumeData.style?.[0]?.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: resumeData.style?.[0]?.fontSize || "14px",
              color: resumeData.style?.[0]?.color || "#1f2937",
              lineHeight: "1.6",
            }}
          >
            {/* Header */}
            <div className="text-center border-b-2 border-gray-200 pb-6 mb-8">
              <h1 className="text-4xl font-bold mb-3 text-gray-900">
                 {resumeData.personalInfo.fullName || "您的姓名"}
               </h1>
              <div className="flex justify-center items-center gap-6 text-gray-600 flex-wrap text-sm">
                {resumeData.personalInfo.email && (
                  <span className="flex items-center gap-1">
                    📧 {resumeData.personalInfo.email}
                  </span>
                )}
                {resumeData.personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    📱 {resumeData.personalInfo.phone}
                  </span>
                )}
                {resumeData.personalInfo.location && (
                  <span className="flex items-center gap-1">
                    📍 {resumeData.personalInfo.location}
                  </span>
                )}
              </div>
            </div>

            {resumeData.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b-2 border-blue-500 pb-2">
                  📝 个人简介
                </h2>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {resumeData.personalInfo.summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b-2 border-blue-500 pb-2">
                  💼 工作经历
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-2"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-1">{exp.position}</h3>
                          <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded">
                          <p>
                            {exp.startDate &&
                              format(new Date(exp.startDate), "yyyy年MM月")}
                            {" - "}
                            {exp.endDate
                              ? format(new Date(exp.endDate), "yyyy年MM月")
                              : "至今"}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                          {exp.description.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b-2 border-blue-500 pb-2">
                  🎓 教育背景
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            {edu.degree} {edu.field && `· ${edu.field}`}
                          </h3>
                          <p className="text-blue-600 font-medium">{edu.school}</p>
                        </div>
                        <div className="text-right text-gray-500 text-sm bg-white px-3 py-1 rounded">
                          <p>
                            {edu.graduationDate &&
                              format(new Date(edu.graduationDate), "yyyy年MM月毕业")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b-2 border-blue-500 pb-2">
                  🛠️ 专业技能
                </h2>
                <div className="flex flex-wrap gap-3">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>此简历由 Resumer 生成 · {new Date().toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}