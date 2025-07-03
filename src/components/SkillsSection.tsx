import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "区块链技术",
      skills: [
        { name: "Solidity", level: 95 },
        { name: "Ethereum", level: 90 },
        { name: "Web3.js", level: 88 },
        { name: "Hardhat", level: 85 }
      ]
    },
    {
      title: "前端开发",
      skills: [
        { name: "React", level: 92 },
        { name: "TypeScript", level: 88 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 90 }
      ]
    },
    {
      title: "后端开发",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Python", level: 80 },
        { name: "GraphQL", level: 75 },
        { name: "IPFS", level: 82 }
      ]
    },
    {
      title: "DeFi & 协议",
      skills: [
        { name: "Uniswap", level: 88 },
        { name: "Compound", level: 85 },
        { name: "Chainlink", level: 80 },
        { name: "OpenZeppelin", level: 90 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            技能专长
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            专注于Web3技术栈，持续学习和掌握最新的区块链开发技术
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <Card key={index} className="glass-morphism">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6">{category.title}</h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-morphism p-8 rounded-2xl inline-block">
            <h3 className="text-3xl font-bold text-white mb-4">持续学习</h3>
            <p className="text-gray-300 max-w-2xl">
              Web3技术发展迅速，我始终保持学习的热情，关注最新的技术趋势和最佳实践，
              确保我的技能始终处于行业前沿。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;