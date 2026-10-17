// Utiliser le fichier Firebase fourni par EAS (variable d'environnement de type file).
// Les compilations GitHub Actions conservent leur propre configuration app.json.
module.exports = ({ config }) => {
  const googleServicesFile =
    process.env.GOOGLE_SERVICES_JSON || config.android?.googleServicesFile;

  return {
    ...config,
    android: {
      ...config.android,
      ...(googleServicesFile ? { googleServicesFile } : {}),
    },
  };
};
