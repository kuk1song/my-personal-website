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
          
          {/* Container for all text content, ensuring left alignment */}
          <div className="text-left">
            <div className="mb-8">
              <h3 className="text-3xl font-light text-[#CAF0F8] mb-2 font-fira">Haokun Song</h3>
              {/* Flex container to keep title on one line */}
              <div className="flex flex-wrap items-center text-lg font-mono">
                <p className="text-[#48CAE4]">AI Product Engineer</p>
                {/* I've added a left margin (ml-3) for spacing and used escaped characters for the angle brackets */}
                <p className="ml-3 text-[#48CAE4]/80 italic">&lt;Full-Stack LLM & Agentic Workflows&gt;</p>
              </div>
            </div>
            
            {/* Horizontal rule for visual separation */}
            <hr className="border-t border-[#48CAE4]/20 my-8" />

            <div>
              <p className="text-xl text-[#CAF0F8] mb-6 font-mono leading-relaxed">
                Hi! I am a Software Engineer focused on AI-native Product Development, Agentic Workflows and Full-Stack delivery. 
              </p>

              <p className="text-xl text-[#CAF0F8] mb-6 font-mono leading-relaxed">
               I turn LLMs into usable features—not just demos—by combining GenAI product thinking with structured engineering. 
              </p>
              
              <p className="text-xl text-[#CAF0F8] mb-8 font-mono leading-relaxed">
                My mission is to build systems that ship, evolve, and create real value for users!
              </p>
            </div>
            
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
              <span>$ cd ../products</span>
            </div>
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