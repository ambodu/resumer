'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Zap, Star, Users, Clock, Shield, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Testimonials from "@/components/testimonials";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  return (
    <main className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        {/* Hero content starts here - navigation is now handled by the global navbar */}

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              AI驱动的专业简历制作工具
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              打造完美简历
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-gray-300">
              开启职业新篇章
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
          >
            使用我们的AI驱动编辑器和精美模板，几分钟内创建专业简历。
            <br className="hidden md:block" />
            让您在求职路上脱颖而出，获得心仪工作。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href={`/${locale}/templates`}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto group"
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
                className="border-gray-600 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
              >
                <Edit className="mr-2 h-5 w-5" />
                从头开始
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>10,000+ 用户信赖</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>5分钟快速创建</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>数据安全保护</span>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                强大功能
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              专业工具助您打造完美简历
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Edit className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">AI智能编辑器</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-300">
                    AI驱动的智能编辑器，实时优化建议，让简历制作变得简单高效。支持多种格式导出。
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">专业模板库</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-300">
                    精心设计的多种模板，适合不同行业和职位。ATS友好设计，确保通过求职系统筛选。
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Download className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">一键导出</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-300">
                    支持PDF和图片格式下载，高清输出质量。完美适配A4纸张，直接用于求职申请。
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-6 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                为什么选择我们？
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              专业、高效、安全的简历制作体验
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">快速高效</h3>
              <p className="text-gray-300">AI驱动，5分钟完成专业简历</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">专业品质</h3>
              <p className="text-gray-300">设计师精心制作的专业模板</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">用户友好</h3>
              <p className="text-gray-300">直观易用的操作界面</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">数据安全</h3>
              <p className="text-gray-300">本地存储，完全保护隐私</p>
            </motion.div>
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <div className="px-6 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 p-12 text-center max-w-4xl mx-auto"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            <motion.div
              className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"
              animate={{
                y: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  准备好开始了吗？
                </span>
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              >
                加入数万名求职者的行列，使用我们的AI平台创建完美简历
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href={`/${locale}/templates`}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto group"
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
                    className="border-gray-600 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    自定义简历
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Resume</span>
              </div>
              
              <div className="text-gray-400 text-sm">
                 © 2024 Resumer. 专业简历制作平台
               </div>
              
              <div className="text-gray-400 text-sm mt-4 md:mt-0">
                © 2024 Resume. 保留所有权利.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}