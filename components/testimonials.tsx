import React from "react";
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
    <section className="section bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            深受 <span className="text-accent-foreground">用户喜爱</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            不要只听我们说，看看全国各地的用户怎么评价我们的产品。
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-primary fill-current"
                  />
                ))}
              </div>

              <Quote className="text-muted-foreground mb-4" size={24} />

              <p className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center space-x-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="text-foreground font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonial.role} • {testimonial.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-6 bg-card border rounded-full px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-primary fill-current"
                  />
                ))}
              </div>
              <span className="text-foreground font-semibold">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="text-muted-foreground">基于 50,000+ 用户评价</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
