import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "张小明",
    role: "软件工程师",
    country: "北京",
    rating: 5,
    text: "Resume完全改变了我制作简历的方式。智能建议让我的简历更加专业，成功获得了心仪的工作。",
    avatar: "👨‍💻",
  },
  {
    name: "李小红",
    role: "产品经理",
    country: "上海",
    rating: 5,
    text: "模板设计非常专业，操作简单易懂。几分钟就能制作出高质量的简历，强烈推荐！",
    avatar: "👩‍💼",
  },
  {
    name: "王小华",
    role: "设计师",
    country: "深圳",
    rating: 5,
    text: "作为设计师，我对视觉效果要求很高。这个平台的模板设计真的很棒，完全符合我的期望。",
    avatar: "👨‍🎨",
  },
  {
    name: "陈小美",
    role: "市场专员",
    country: "广州",
    rating: 5,
    text: "从学生到职场新人，这个工具帮我制作了第一份专业简历。界面友好，功能强大。",
    avatar: "👩‍💻",
  },
  {
    name: "刘小强",
    role: "数据分析师",
    country: "杭州",
    rating: 5,
    text: "数据安全做得很好，本地存储让我很放心。AI优化建议也很实用，提升了简历质量。",
    avatar: "👨‍💼",
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 bg-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            深受 <span className="text-blue-400 font-medium">用户喜爱</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            不要只听我们说，看看全国各地的用户怎么评价我们的产品。
          </p>
        </motion.div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex space-x-6"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-80 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-blue-400 fill-current"
                    />
                  ))}
                </div>

                <Quote className="text-slate-600 mb-4" size={24} />

                <p className="text-slate-300 mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonial.role} • {testimonial.country}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-full px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-blue-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-white font-semibold">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-slate-600" />
            <div className="text-slate-400">基于 50,000+ 用户评价</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
