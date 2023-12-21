// PrintImage.tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactDOM from 'react-dom';

interface PrintImageProps {
  capturedImage: string;
  userText?: string;
}

const PrintImage: React.FC<PrintImageProps> = ({ capturedImage, userText }) => {
  const componentToHtmlString = (component: React.ReactNode) => {
    const wrapper = document.createElement('div');
    ReactDOM.render(component, wrapper);
    return wrapper.innerHTML;
  };

  const printContent = document.createElement('div');
  printContent.style.textAlign = 'center';

  const printImage = new Image();
  printImage.src = capturedImage;
  printImage.style.maxWidth = '100%';
  printImage.style.maxHeight = '100vh';
  printContent.appendChild(printImage);

  if (userText) {
    const textElement = document.createElement('div');
    textElement.innerText = userText;
    textElement.style.marginTop = '10px';
    printContent.appendChild(textElement);
  }

  const qrCodeHTML = componentToHtmlString(
    <div style={{ position: 'absolute', top: '0', right: '0', padding: '0' }}>
      <QRCodeSVG value="https://reactjs.org/" size={64} />
    </div>
  );

  printContent.innerHTML += qrCodeHTML;

  return (
    <html>
      <head>
        <title>Print Image</title>
      </head>
      <body style={{ margin: '0' }}>{printContent.outerHTML}</body>
    </html>
  );
};

export default PrintImage;
