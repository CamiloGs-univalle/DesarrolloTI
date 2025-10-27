export const getLogoEmpresa = (texto) => {
  if (!texto) return null;
  const valor = texto.toLowerCase();

  const logos = {
    proservis: "/logo/ProservisTemporales.png",
    affine: "/logo/Affine.png",
    siamo: "/logo/Siamo.png",
    mendiola: "/logo/Mendiola.png",
    anfibia: "/logo/Anfibia.png",
    samalo: "/logo/Samalo.png",
  };

  return Object.keys(logos).find((k) => valor.includes(k))
    ? logos[Object.keys(logos).find((k) => valor.includes(k))]
    : null;
};
