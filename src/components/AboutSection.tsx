import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span className="font-mono text-[#48CAE4] opacity-70 mr-2">02.</span>
            <h2 className="text-5xl font-light mb-2 text-gradient tracking-wide font-fira">
              About Me
            </h2>
          </div>
          <div className="w-20 h-px bg-[#48CAE4]/30 mx-auto"></div>
        </div>

        <div className="glass-card p-10 rounded-none border-l-2 border-[#48CAE4]">
          <div className="mb-4 opacity-60">
            <span className="font-mono text-[#48CAE4]">// personal_statement.js</span>
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl font-light text-[#CAF0F8] mb-2 font-fira">Haokun Song</h3>
            <p className="text-lg text-[#48CAE4] font-mono">Software Engineer & AI Product Builder</p>
          </div>
          
          <p className="text-xl text-[#CAF0F8] mb-6 font-mono leading-relaxed">
            Best friend with AI. Innovative and detail-driven Software Engineer & AI Product Builder, 
            specializing in AI-native and AI-powered systems.
          </p>
          
          <p className="text-xl text-[#CAF0F8] mb-8 font-mono leading-relaxed">
            Skilled in rapidly building full-stack applications powered by LLMs, vector search, and real-time pipelines. 
            Passionate about turning cutting-edge AI into practical, scalable products!
          </p>
          
          <div className="space-y-2 font-mono text-sm text-[#48CAE4]/90">
            <div>
              <span className="text-[#48CAE4]">email:</span> 
              <a href="mailto:shk741612898@gmail.com" className="ml-2 hover:text-[#CAF0F8] transition-colors">
                shk741612898@gmail.com
              </a>
            </div>
            <div>
              <span className="text-[#48CAE4]">linkedin:</span> 
              <a 
                href="https://www.linkedin.com/in/haokun-song/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 hover:text-[#CAF0F8] transition-colors"
              >
                linkedin.com/in/haokun-song
              </a>
            </div>
          </div>
          
          <div className="mt-8 font-mono text-sm text-[#48CAE4]/90">
            <span>$ cd projects</span>
          </div>
        </div>
        
        {/* Art elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-[#48CAE4]/10 rotate-12"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-[#90E0EF]/10 rotate-45"></div>
      </div>
    </section>
  );
};

export default AboutSection;