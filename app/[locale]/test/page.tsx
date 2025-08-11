"use client";

import React from 'react';
import { ResumeEditor } from '@/components/editor/resume-editor';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">简历编辑器测试页面</h1>
        <ResumeEditor />
      </div>
    </div>
  );
}