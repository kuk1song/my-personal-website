import React from 'react';

const ProductsSection = () => {
  return (
    <section id="products-section" className="absolute inset-0 h-screen w-screen flex flex-col items-center justify-center opacity-0">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-mono text-[#48CAE4] opacity-70 mr-2">03.</span>
            <h2 className="text-5xl font-light mb-2 text-gradient tracking-wide font-fira">
              Products
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
              Products will be added here soon...
            </p>
            <div className="mt-8 font-mono text-sm text-[#48CAE4]/90">
              <span>$ git commit -m "Building amazing AI products"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;