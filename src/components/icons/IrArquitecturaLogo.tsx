import React from 'react';

/**
 * IrArquitecturaLogo Component
 * Displays the IrArquitectura logo image and the text "arquitectura".
 * Accepts standard HTML props like className, etc.
 */
export const IrArquitecturaLogo: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} {...props}>
      {/* Image tag for the logo */}
      {/* Assumes logo-negro.png is in the public folder */}
      {/* <img src="/logo-negro.png" alt="IrArquitectura Logo" style={{ height: '30px', marginRight: '10px' }} /> */}
      {/* Text next to the logo */}
      <span style={{ fontFamily: 'Inter, sans-serif' }}> IR arquitectura</span>
    </div>
  );
}; 