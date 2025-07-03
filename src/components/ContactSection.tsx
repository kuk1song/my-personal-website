import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "邮箱",
      value: "hello@web3dev.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "电话",
      value: "+86 138 0013 8000"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "位置",
      value: "上海，中国"
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            联系我
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            有项目想法或合作机会？让我们一起构建Web3的未来
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-white mb-8">联系信息</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="glass-morphism hover:neon-glow transition-all duration-300">
                  <CardContent className="p-6 flex items-center">
                    <div className="text-purple-400 mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{info.title}</h4>
                      <p className="text-gray-300">{info.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-bold text-white mb-4">为什么选择我？</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• 5年以上区块链开发经验</li>
                <li>• 参与过多个成功的DeFi项目</li>
                <li>• 深度理解Web3生态系统</li>
                <li>• 注重代码质量和安全性</li>
                <li>• 快速响应和良好沟通</li>
              </ul>
            </div>
          </div>

          <div>
            <Card className="glass-morphism">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6">发送消息</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="您的姓名" 
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Input 
                      type="email" 
                      placeholder="您的邮箱" 
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <Input 
                    placeholder="项目主题" 
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Textarea 
                    placeholder="项目详情描述..." 
                    rows={5}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button className="w-full neon-glow bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Send className="w-4 h-4 mr-2" />
                    发送消息
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;