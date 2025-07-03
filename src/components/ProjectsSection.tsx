import React from 'react';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-mono text-[#48CAE4] opacity-70 mr-2">03.</span>
            <h2 className="text-5xl font-light mb-2 text-gradient tracking-wide font-fira">
              Projects
            </h2>
          </div>
          <div className="w-20 h-px bg-[#48CAE4]/30 mx-auto"></div>
        </div>

        <div className="text-center">
          <div className="glass-card p-16 rounded-none border border-[#48CAE4]/20">
            <div className="mb-4 opacity-60">
              <span className="font-mono text-[#48CAE4]">// coming_soon.js</span>
            </div>
            <p className="text-xl text-[#CAF0F8] font-mono leading-relaxed">
              Projects will be added here soon...
            </p>
            <div className="mt-8 font-mono text-sm text-[#48CAE4]/90">
              <span>$ git commit -m "Building amazing AI products"</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Art elements */}
      <div className="absolute top-40 left-0 w-40 h-40 bg-[#0077B6] rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute bottom-20 right-0 w-60 h-60 bg-[#48CAE4] rounded-full blur-[120px] opacity-5"></div>
    </section>
  );
};

export default ProjectsSection;