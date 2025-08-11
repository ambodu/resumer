import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Edit,
  Zap,
  Star,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Testimonials from "@/components/testimonials";
import { locales } from "@/lib/i18n";

interface HomeProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home({ params: { locale } }: HomeProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
                <span className="text-primary">打造完美简历</span>
                <br />
                <span className="text-3xl md:text-4xl text-muted-foreground">
                  开启职业新篇章
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
                使用我们的AI驱动编辑器和精美模板，几分钟内创建专业简历。
                <br className="hidden md:block" />
                让您在求职路上脱颖而出，获得心仪工作。
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href={`/${locale}/templates`}>
                  <Button
                    size="lg"
                    className="btn-primary text-lg px-8 py-4 h-auto group"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    浏览模板
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href={`/${locale}/editor`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 h-auto"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    从头开始
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>10,000+ 用户信赖</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>5分钟快速创建</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>数据安全保护</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                强大功能
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                专业工具助您打造完美简历
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Edit className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">AI智能编辑器</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    AI驱动的智能编辑器，实时优化建议，让简历制作变得简单高效。支持多种格式导出。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">专业模板库</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    精心设计的多种模板，适合不同行业和职位。ATS友好设计，确保通过求职系统筛选。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">一键导出</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    支持PDF和图片格式下载，高清输出质量。完美适配A4纸张，直接用于求职申请。
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                为什么选择我们？
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                专业、高效、安全的简历制作体验
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-2xl bg-card border card-hover">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">快速高效</h3>
                <p className="text-muted-foreground">
                  AI驱动，5分钟完成专业简历
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-card border card-hover">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">专业品质</h3>
                <p className="text-muted-foreground">
                  设计师精心制作的专业模板
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-card border card-hover">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">用户友好</h3>
                <p className="text-muted-foreground">直观易用的操作界面</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-card border card-hover">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">数据安全</h3>
                <p className="text-muted-foreground">本地存储，完全保护隐私</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <section className="section bg-muted/30">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl text-center max-w-4xl mx-auto">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                  准备好开始了吗？
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  加入数万名求职者的行列，使用我们的AI平台创建完美简历
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/${locale}/templates`}>
                    <Button
                      size="lg"
                      className="btn-primary text-lg px-8 py-4 h-auto group"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      立即创建简历
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={`/${locale}/editor`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-4 h-auto"
                    >
                      <Edit className="mr-2 h-5 w-5" />
                      自定义简历
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/20">
          <div className="container py-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Resumer</span>
              </div>

              <div className="text-muted-foreground text-sm">
                © 2024 Resumer. 专业简历制作平台
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
