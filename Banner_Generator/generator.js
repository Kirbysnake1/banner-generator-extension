const nameInput = document.getElementById('name_Img');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const formatSelect = document.getElementById('format');
    const qualitySelect = document.getElementById('quality');
    const complexitySelect = document.getElementById('complexity');
    const generateBtn = document.getElementById('generate');
    const sizeInfo = document.getElementById('sizeInfo');
    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function drawBanner(w, h, complexity) {
      canvas.width = w;
      canvas.height = h;

      // Fondo con franjas de colores
      for (let i = 0; i < complexity + 1; i++) {
        const hue = Math.round((360 / (complexity+1)) * i + Math.random() * 30);
        ctx.fillStyle = `hsl(${hue}, ${50+Math.random()*40}%, ${40+Math.random()*30}%)`;
        const x = (w / (complexity+1)) * i;
        ctx.fillRect(x, 0, w/(complexity+1)+2, h);
      }

      // Añadir ruido
      let noiseDensity = complexity * 0.02;
      if (complexity >= 6) noiseDensity = 0.3;
      if (complexity === 7) noiseDensity = 0.6; // mucho más denso
      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (Math.random() < noiseDensity) {
          if (complexity >= 6) {
            // ruido a color para más peso
            pixels[i] = Math.floor(Math.random() * 255);
            pixels[i+1] = Math.floor(Math.random() * 255);
            pixels[i+2] = Math.floor(Math.random() * 255);
          } else {
            const shade = Math.floor(Math.random() * 255);
            pixels[i] = shade;
            pixels[i+1] = shade;
            pixels[i+2] = shade;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Patrones de líneas
      let lines = complexity * 15;
      if (complexity === 7) lines = w * 3; // exagerar
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random()*w, Math.random()*h);
        ctx.lineTo(Math.random()*w, Math.random()*h);
        ctx.stroke();
      }

      // Círculos desde detallado (4 en adelante)
      if (complexity >= 4) {
        let circleCount = complexity * 400;
        if (complexity === 7) circleCount = 12000; // exagerar
        for (let i = 0; i < circleCount; i++) {
          ctx.beginPath();
          ctx.arc(Math.random()*w, Math.random()*h, Math.random()*8 + 2, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`;
          ctx.fill();
        }
      }

      // Rectángulos y detalles extra solo en máximo
      if (complexity === 7) {
        for (let i = 0; i < 500; i++) {
          ctx.fillStyle = `rgba(${Math.floor(Math.random()*500)}, ${Math.floor(Math.random()*500)}, ${Math.floor(Math.random()*255)}, 0.5)`;
          ctx.fillRect(Math.random()*w, Math.random()*h, Math.random()*15, Math.random()*15);
        }
      }

      // Texto principal
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = `${Math.max(12, Math.floor(h/12))}px Arial`;
      ctx.fillText(nameInput.value || "Banner", w/2, h/2);

      // Texto secundario
      ctx.font = `${Math.max(10, Math.floor(h/25))}px Arial`;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(`${formatSelect.value.toUpperCase()} - ${w}x${h}px`, w/2, h/2 + (h/12));
    }

    function getDataUrlAndSize(format, quality) {
      let dataUrl;
      if (format === 'png') dataUrl = canvas.toDataURL('image/png');
      else if (format === 'jpeg') dataUrl = canvas.toDataURL('image/jpeg', quality);
      else if (format === 'webp') dataUrl = canvas.toDataURL('image/webp', quality);
      else dataUrl = canvas.toDataURL();
      const base64 = dataUrl.split(',')[1] || '';
      const bytes = Math.floor(base64.length * 3 / 4);
      return { dataUrl, bytes };
    }

    function updatePreview() {
      const w = parseInt(widthInput.value) || 1;
      const h = parseInt(heightInput.value) || 1;
      const complexity = parseInt(complexitySelect.value);
      const format = formatSelect.value;
      const quality = parseFloat(qualitySelect.value);

      drawBanner(w, h, complexity);
      const { bytes } = getDataUrlAndSize(format, quality);
      sizeInfo.textContent = `Peso aprox: ${(bytes/1024).toFixed(1)} KB (${bytes.toLocaleString()} bytes)`;
    }

    [nameInput,widthInput,heightInput,formatSelect,qualitySelect,complexitySelect]
      .forEach(el => el.addEventListener('input', updatePreview));

    generateBtn.addEventListener('click', () => {
      updatePreview();
      const w = parseInt(widthInput.value) || 1;
      const h = parseInt(heightInput.value) || 1;
      const name = (nameInput.value || "banner").replace(/\s+/g,"_");
      const format = formatSelect.value;
      const quality = parseFloat(qualitySelect.value);
      const { dataUrl } = getDataUrlAndSize(format, quality);
      const link = document.createElement('a');
      link.download = `${name}_${w}x${h}.${format === 'jpeg' ? 'jpg' : format}`;
      link.href = dataUrl;
      link.click();
    });

    updatePreview();